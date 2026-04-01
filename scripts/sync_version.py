#!/usr/bin/env python3
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
version = (root / "VERSION").read_text(encoding="utf-8").strip()

index_path = root / "index.html"
sw_path = root / "sw.js"

index = index_path.read_text(encoding="utf-8")
index = re.sub(r'(<span id="app-version"[^>]*>v)([^<]+)(</span>)', rf"\g<1>{version}\3", index, count=1)
index = re.sub(r'const APP_VERSION = "([^"]+)";', f'const APP_VERSION = "{version}";', index, count=1)
index_path.write_text(index, encoding="utf-8")

sw = sw_path.read_text(encoding="utf-8")
sw = re.sub(r'const CACHE = "agroapp-v[^"]+";', f'const CACHE = "agroapp-v{version}";', sw, count=1)
sw_path.write_text(sw, encoding="utf-8")

print(f"Synced app version to {version}")
