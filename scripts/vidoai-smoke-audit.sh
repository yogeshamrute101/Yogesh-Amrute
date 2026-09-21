#!/usr/bin/env bash
set -u

PASS=0
WARN=0

check() {
  local label="$1"
  local path="$2"

  if [ -e "$path" ]; then
    echo "PASS | $label | $path"
    PASS=$((PASS+1))
  else
    echo "WARN | $label | $path"
    WARN=$((WARN+1))
  fi
}

check "React application" "src"
check "App entry" "src/App.tsx"
check "Universal core" "src/core/universal"
check "Master orchestrator" "src/core/universal/MasterOrchestrator.ts"
check "Master command" "src/core/universal/MasterCommand.ts"
check "Universal bridge" "src/core/universal/UniversalCopilotBridge.ts"
check "Copilot UI" "src/components/AiCoPilotModal.tsx"
check "Reel Maker API" "server.ts"
check "AI services" "server/ai"
check "Captions" "src/screens/CaptionsScreen.tsx"
check "Editor" "src/screens/EditorScreen.tsx"

echo ""
echo "PASS=$PASS"
echo "WARN=$WARN"
