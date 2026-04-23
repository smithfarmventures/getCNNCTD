#!/bin/bash
# CNNCTD local dev launcher
# Opens three terminal tabs: API, Web, Mobile (iOS Simulator)
#
# Prerequisites:
#   - Xcode installed from the Mac App Store (free, ~10 GB)
#   - After installing Xcode, open it once and accept the license agreement
#   - Then run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
#
# The iOS Simulator uses Mac localhost, so no WiFi/IP config is needed.

set -e

PROJECT_DIR="/Users/cohen_andrew/Documents/Claude Projects/getCNNCTD"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║       CNNCTD Dev Environment         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Preflight checks ────────────────────────────────────────
if [ ! -f "$PROJECT_DIR/api/.env" ]; then
  echo "⚠️  Missing api/.env — copy api/.env.example and fill in DATABASE_URL + JWT_SECRET"
  exit 1
fi

# Check Xcode / Simulator availability
if ! xcrun simctl list devices booted &>/dev/null; then
  echo "⚠️  Xcode Simulator not found."
  echo ""
  echo "   To set it up:"
  echo "   1. Install Xcode from the Mac App Store (free)"
  echo "   2. Open Xcode once and accept the license"
  echo "   3. Run: sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  echo "   4. Re-run this script"
  echo ""
  echo "   Falling back to Expo QR-code mode (scan with Expo Go on your phone)."
  MOBILE_CMD="npm install && npx expo start"
else
  echo "✅  Xcode Simulator found"
  MOBILE_CMD="npm install && npx expo start --ios"
fi

echo ""
echo "Starting services..."
echo ""

# ── API ─────────────────────────────────────────────────────
osascript -e "tell application \"Terminal\"
  activate
  tell application \"System Events\" to keystroke \"t\" using command down
  delay 0.4
  do script \"echo '── CNNCTD API ──' && cd \\\"$PROJECT_DIR/api\\\" && npm install && npm run dev\" in front window
end tell"

sleep 0.5

# ── Web ─────────────────────────────────────────────────────
osascript -e "tell application \"Terminal\"
  activate
  tell application \"System Events\" to keystroke \"t\" using command down
  delay 0.4
  do script \"echo '── CNNCTD Web ──' && cd \\\"$PROJECT_DIR/web\\\" && npm install && npm run dev\" in front window
end tell"

sleep 0.5

# ── Mobile (iOS Simulator) ───────────────────────────────────
osascript -e "tell application \"Terminal\"
  activate
  tell application \"System Events\" to keystroke \"t\" using command down
  delay 0.4
  do script \"echo '── CNNCTD Mobile ──' && cd \\\"$PROJECT_DIR/mobile\\\" && $MOBILE_CMD\" in front window
end tell"

echo "╔══════════════════════════════════════╗"
echo "║  Three terminal tabs are opening...  ║"
echo "╠══════════════════════════════════════╣"
echo "║  API    → http://localhost:3000      ║"
echo "║  Web    → http://localhost:3001      ║"
echo "║  Mobile → iOS Simulator (auto-open)  ║"
echo "╚══════════════════════════════════════╝"
echo ""
