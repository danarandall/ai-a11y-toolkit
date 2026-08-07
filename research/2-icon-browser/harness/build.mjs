import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = STUDY;
const ARMS = ['control', 'treatment'];

const MAIN = `import React from 'react';
import { createRoot } from 'react-dom/client';
import IconBrowser from './IconBrowser';
import { fileURLToPath } from 'node:url';
const STUDY = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
createRoot(document.getElementById('root')).render(React.createElement(IconBrowser));
`;

// Identical shell for both arms. Deliberately minimal: it supplies no landmarks,
// no headings, and no styling of its own, so every structural element in the
// scan result comes from the component under test.
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Icon Browser</title>
<link rel="stylesheet" href="./bundle.css">
</head>
<body>
<div id="root"></div>
<script src="./bundle.js"></script>
</body>
</html>
`;

for (const arm of ARMS) {
  const src = path.join(ROOT, arm, 'src');
  const out = path.join(ROOT, 'dist', arm);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(src, 'main.jsx'), MAIN);

  try {
    await esbuild.build({
      entryPoints: [path.join(src, 'main.jsx')],
      bundle: true,
      outfile: path.join(out, 'bundle.js'),
      loader: { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx' },
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' },
      minify: false,
      logLevel: 'silent',
    });
    if (!fs.existsSync(path.join(out, 'bundle.css'))) {
      fs.writeFileSync(path.join(out, 'bundle.css'), '');
    }
    fs.writeFileSync(path.join(out, 'index.html'), HTML);
    console.log(`${arm}: built ok`);
  } catch (e) {
    console.log(`${arm}: BUILD FAILED`);
    console.log((e.message || String(e)).slice(0, 3000));
    if (e.errors) for (const err of e.errors.slice(0, 10)) {
      console.log('  ', err.text, err.location ? `${err.location.file}:${err.location.line}` : '');
    }
  }
}
