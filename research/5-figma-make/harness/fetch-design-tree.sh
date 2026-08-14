#!/usr/bin/env bash
# Pull one Figma page's full node tree and wrap it the way the audit scripts expect.
#
# Needs a Figma personal access token with file read scope:
#   export FIGMA_TOKEN=figd_...
#
# The two trees in ../data were produced with:
#   ./fetch-design-tree.sh K2UUFuil7G3IqbUP0ZP01F 0:1  ../data/design-treatment-tree.json
#   ./fetch-design-tree.sh K2UUFuil7G3IqbUP0ZP01F 10:2 ../data/design-control-tree.json
set -euo pipefail

FILE_KEY="${1:?file key}"
NODE_ID="${2:?node id, for example 0:1}"
OUT="${3:?output path}"

curl -sS -H "X-Figma-Token: ${FIGMA_TOKEN:?set FIGMA_TOKEN}" \
  "https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}" \
| python3 -c "
import json, sys
d = json.load(sys.stdin)
node = d['nodes']['${NODE_ID}']['document']
json.dump({'file': {'document': node}}, open('${OUT}', 'w'))
print('wrote ${OUT}')
"
