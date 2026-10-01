# VidoAI Autonomous Execution

Read and follow:
- AI_IDENTITY.md
- MASTER_PROMPT.md

## Objective
Continue the existing VidoAI project toward the Talking Robot AI platform.

## Rules
1. Preserve existing working VidoAI features.
2. Inspect before changing.
3. Implement feasible work directly in the existing architecture.
4. Integrate changes; do not create disconnected demos.
5. Prefer provider abstractions where external API credentials are unavailable.
6. Never expose secrets.
7. Never add arbitrary shell execution from user prompts.
8. Test every major change.
9. Automatically diagnose and fix errors.
10. Continue without asking for confirmation.

## Required execution loop
INSPECT
→ IMPLEMENT
→ INTEGRATE
→ TEST
→ DIAGNOSE
→ FIX
→ RE-TEST
→ CONTINUE

## Target capabilities
- Talking Robot UI
- text conversation
- microphone/STT abstraction
- TTS abstraction
- avatar speaking/listening/thinking states
- multimodal input
- document/research workflow
- project memory
- AI agent orchestration
- existing UniversalCore/MasterAgent/ToolBus integration
- script generation
- video generation workflow
- VidoAI editor control
- captions/audio/effects/export integration
- authentication/project persistence architecture
- permissions and verification
- recovery/error handling
- modern responsive UI

## Completion validation
Run:
npm run lint
npm run build

Fix all feasible errors and repeat validation.

Do not stop after planning.
Do not ask for confirmation.
Stop only when feasible implementation is complete or a genuine external/environment blocker remains.

# FINAL STOP CONDITION

DO NOT STOP AFTER PLANNING.
DO NOT STOP AFTER ONE FEATURE.
DO NOT STOP AFTER A PARTIAL IMPLEMENTATION.
DO NOT ASK FOR USER CONFIRMATION.

CONTINUE:

INSPECT
→ IMPLEMENT
→ INTEGRATE
→ TEST
→ DIAGNOSE
→ FIX
→ RE-TEST
→ AUDIT
→ CONTINUE

STOP ONLY WHEN:

1. ALL FEASIBLE IMPLEMENTATION WORK IS COMPLETE.
2. ALL FEASIBLE INTEGRATIONS ARE COMPLETE.
3. EXISTING VIDOAI FEATURES ARE PRESERVED.
4. TALKING ROBOT AI FEATURES ARE INTEGRATED.
5. ERRORS FOUND DURING TESTING HAVE BEEN FIXED WHERE FEASIBLE.
6. npm run lint PASSES.
7. npm run build PASSES.
8. NO OBVIOUS PLACEHOLDER/DEAD IMPLEMENTATION REMAINS IN THE WORK JUST COMPLETED.
9. FINAL PROJECT AUDIT IS COMPLETE.

If an external API, credential, provider, or environment limitation blocks one feature:

- implement the provider abstraction,
- implement all provider-independent functionality,
- integrate the abstraction,
- document the exact external requirement,
- continue with every other feasible task.

DO NOT STOP BECAUSE ONE COMPONENT IS BLOCKED.

FINAL STOP CONDITION:
"FEASIBLE IMPLEMENTATION COMPLETE"

Only then provide the final completion report.
