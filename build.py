#!/usr/bin/env python3
"""
Bonheur Eternal — static site builder.

Reads src/template.html, expands every
    <!-- @include path/to/fragment.html -->
directive with that file's contents (paths resolved relative to src/),
and writes the result to ./index.html.

Usage:
    python3 build.py            # build once
    python3 build.py --watch    # rebuild on change (stdlib only, polling)
"""

from __future__ import annotations

import argparse
import re
import sys
import time
from pathlib import Path

ROOT      = Path(__file__).resolve().parent
SRC       = ROOT / "src"
TEMPLATE  = SRC / "template.html"
OUTPUT    = ROOT / "index.html"

# Matches: <!-- @include path/to/file.html -->   (leading indent preserved)
INCLUDE_RE = re.compile(
    r"^(?P<indent>[ \t]*)<!--\s*@include\s+(?P<path>[^\s]+)\s*-->\s*$",
    re.MULTILINE,
)


def render(template_path: Path, seen: set[Path] | None = None) -> str:
    """Recursively expand @include directives inside a template file."""
    seen = seen or set()
    resolved = template_path.resolve()
    if resolved in seen:
        raise RuntimeError(f"circular include detected: {resolved}")
    seen = seen | {resolved}

    text = template_path.read_text(encoding="utf-8")

    def replace(match: re.Match[str]) -> str:
        indent = match.group("indent")
        include_path = (SRC / match.group("path")).resolve()
        if not include_path.exists():
            raise FileNotFoundError(
                f"included file not found: {include_path} "
                f"(from {template_path.relative_to(ROOT)})"
            )
        content = render(include_path, seen)
        # Re-indent each line with the leading whitespace of the directive
        # so nested structure stays readable in the generated file.
        if indent:
            content = "\n".join(
                (indent + line) if line else line
                for line in content.splitlines()
            )
        return content

    return INCLUDE_RE.sub(replace, text)


def build() -> None:
    if not TEMPLATE.exists():
        raise SystemExit(f"missing template: {TEMPLATE}")
    html = render(TEMPLATE)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"built {OUTPUT.relative_to(ROOT)} ({len(html):,} chars)")


def iter_sources() -> list[Path]:
    return list(SRC.rglob("*.html"))


def watch(poll: float = 0.6) -> None:
    print(f"watching {SRC.relative_to(ROOT)}/ for changes (Ctrl-C to stop)…")
    mtimes: dict[Path, float] = {p: p.stat().st_mtime for p in iter_sources()}
    build()
    try:
        while True:
            time.sleep(poll)
            current = iter_sources()
            changed = False
            for p in current:
                mt = p.stat().st_mtime
                if mtimes.get(p) != mt:
                    mtimes[p] = mt
                    changed = True
            # Detect deletions
            if set(mtimes) - set(current):
                for p in list(mtimes):
                    if p not in current:
                        mtimes.pop(p, None)
                changed = True
            if changed:
                try:
                    build()
                except Exception as e:
                    print(f"build error: {e}", file=sys.stderr)
    except KeyboardInterrupt:
        print("\nstopped.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--watch", action="store_true", help="rebuild on source change")
    args = parser.parse_args()

    try:
        if args.watch:
            watch()
        else:
            build()
    except Exception as e:
        print(f"build failed: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
