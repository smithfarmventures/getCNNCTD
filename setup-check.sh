#!/bin/bash
# CNNCTD Setup Checker
# Run this once to verify your dev environment is ready.
# Usage: bash setup-check.sh

PASS="✅"
FAIL="❌"
WARN="⚠️ "

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     CNNCTD Environment Check         ║"
echo "╚══════════════════════════════════════╝"
echo ""

ALL_GOOD=true

# ── Node.js ─────────────────────────────────────────────────
if command -v node &>/dev/null; then
  NODE_VER=$(node --version)
  echo "$PASS  Node.js $NODE_VER"
else
  echo "$FAIL  Node.js not found — install from https://nodejs.org"
  ALL_GOOD=false
fi

# ── npm ─────────────────────────────────────────────────────
if command -v npm &>/dev/null; then
  echo "$PASS  npm $(npm --version)"
else
  echo "$FAIL  npm not found (comes with Node.js)"
  ALL_GOOD=false
fi

# ── Xcode ───────────────────────────────────────────────────
if xcode-select -p &>/dev/null; then
  XCODE_PATH=$(xcode-select -p)
  echo "$PASS  Xcode developer tools → $XCODE_PATH"
else
  echo "$FAIL  Xcode not found"
  echo "        → Install Xcode from the Mac App Store (free, ~10 GB)"
  echo "        → Open Xcode once to accept the license"
  echo "        → Then run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  ALL_GOOD=false
fi

# ── iOS Simulator ────────────────────────────────────────────
if xcrun simctl list devices 2>/dev/null | grep -q "iPhone"; then
  SIM=$(xcrun simctl list devices available 2>/dev/null | grep "iPhone" | head -1 | xargs)
  echo "$PASS  iOS Simulator available ($SIM)"
else
  echo "$WARN iOS Simulator devices not found — open Xcode → Window → Devices and Simulators to add one"
  ALL_GOOD=false
fi

# ── api/.env ─────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/api/.env" ]; then
  if grep -q "DATABASE_URL=postgresql" "$SCRIPT_DIR/api/.env"; then
    echo "$PASS  api/.env present with DATABASE_URL"
  else
    echo "$WARN api/.env found but DATABASE_URL looks empty — fill it in before starting"
  fi
  if grep -q "JWT_SECRET=" "$SCRIPT_DIR/api/.env" && ! grep -q "JWT_SECRET=$" "$SCRIPT_DIR/api/.env"; then
    echo "$PASS  api/.env has JWT_SECRET"
  else
    echo "$WARN api/.env is missing JWT_SECRET — add a random string"
  fi
else
  echo "$FAIL  api/.env missing — copy api/.env.example and fill in DATABASE_URL + JWT_SECRET"
  ALL_GOOD=false
fi

# ── node_modules ─────────────────────────────────────────────
for dir in api web mobile; do
  if [ -d "$SCRIPT_DIR/$dir/node_modules" ]; then
    echo "$PASS  $dir/node_modules present"
  else
    echo "$WARN $dir/node_modules missing — will be installed on first run of dev-start.sh"
  fi
done

echo ""
if $ALL_GOOD; then
  echo "🎉  All checks passed! Run ./dev-start.sh to start the app."
else
  echo "🔧  Fix the items above, then run ./dev-start.sh"
fi
echo ""
