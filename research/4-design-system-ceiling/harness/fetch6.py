import json, subprocess, os, time

K = "1EUiJ5SPjZdOecONO6tk3h"
PAGES = {
    "typography": "115:24128",
    "grids": "115:24293",
    "inputs": "605:6420",
    "tables": "605:6429",
    "tabs": "605:6430",
    "toggles": "507:26911",
    "badges": "605:6415",
    "alerts": "605:6413",
    "modals": "605:6422",
    "tooltips": "605:6431",
    "pagination": "716:15555",
    "sliders": "605:6428",
    "menus": "605:6423",
    "navheaders": "716:16182",
    "sidebars": "716:16184",
}
os.makedirs("raw6", exist_ok=True)
for name, nid in PAGES.items():
    path = f"raw6/{name}.json"
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        print("skip", name, flush=True); continue
    for a in range(3):
        p = subprocess.run(["external-tool", "call", json.dumps({
            "source_id": "figma_mcp_merge", "tool_name": "figma__get_file",
            "arguments": {"input": {"file_key": K, "ids": nid, "depth": None,
                          "version": None, "geometry": None, "plugin_data": None,
                          "branch_data": None}}})], capture_output=True, text=True)
        if p.returncode == 0 and len(p.stdout) > 1000:
            open(path, "w").write(p.stdout)
            print(f"ok {name:12} {len(p.stdout):>12,}", flush=True)
            break
        print(f"retry {name} {p.stderr[:120]}", flush=True)
        time.sleep(5 * (a + 1))
    else:
        print("FAIL", name, flush=True)
print("DONE", flush=True)
