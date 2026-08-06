import json, subprocess, sys, os, time

FILE_KEY = "qcLb23k17Jp6icsxsXA35y"
OUT = "/home/user/workspace/prime-study/raw"
os.makedirs(OUT, exist_ok=True)

PAGES = {
    "colors": "2:5",
    "typography": "2:6",
    "grid-spacing": "113:398",
    "buttons": "124:3262",
    "inputs": "145:1157",
    "tables": "180:2380",
    "tabs": "180:2381",
    "toggles": "126:564",
    "alerts": "131:1403",
    "modals": "149:1298",
    "pagination": "149:1299",
    "tooltips": "180:2382",
    "sliders": "209:3003",
    "progress": "180:2383",
    "badges": "131:859",
}

def call(tool, args):
    p = subprocess.run(
        ["external-tool", "call", json.dumps(
            {"source_id": "figma_mcp_merge", "tool_name": tool, "arguments": args})],
        capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr[:600])
    return json.loads(p.stdout)

want = sys.argv[1:] or list(PAGES)
for name in want:
    nid = PAGES[name]
    path = f"{OUT}/{name}.json"
    if os.path.exists(path) and os.path.getsize(path) > 200:
        print(f"skip  {name}"); continue
    for attempt in range(3):
        try:
            r = call("figma__get_file", {"input": {
                "file_key": FILE_KEY, "ids": nid, "depth": None, "version": None,
                "geometry": None, "plugin_data": None, "branch_data": None}})
            with open(path, "w") as f:
                json.dump(r, f)
            print(f"ok    {name:14} {os.path.getsize(path):>9,} bytes")
            break
        except Exception as e:
            msg = str(e)[:200].replace("\n", " ")
            print(f"retry {name} attempt {attempt+1}: {msg}")
            time.sleep(4 * (attempt + 1))
    else:
        print(f"FAIL  {name}")
