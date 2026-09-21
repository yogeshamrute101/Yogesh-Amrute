# VidoAI — Universal AI Video Creator

## Core Concept

VidoAI is an AI-assisted video creation system designed around one
simple interaction:

USER COMMAND
→ UNDERSTAND
→ PLAN
→ PRIORITIZE
→ REMOVE UNNECESSARY WORK
→ EXECUTE
→ VERIFY
→ RECOVER
→ LEARN
→ COMPLETE

## Existing Capabilities

- AI Copilot
- AI Reel Maker
- Video Editor
- Timeline
- Captions
- Audio
- Effects
- Export
- Project handling
- Recovery architecture

## Universal System

The Universal Core provides:

1. Command intake
2. Task decomposition
3. Priority handling
4. First-created task ordering
5. Unnecessary-step avoidance
6. Orchestration
7. Verification
8. Recovery
9. Learning memory
10. System status

## Design Principle

The system should prefer the simplest valid path to completion.

It should not recreate existing functionality when an existing feature
can perform the required work.

It should preserve existing project functionality and add orchestration
around it.

## Important Technical Boundary

Universal orchestration coordinates feature execution.
Feature-specific implementations remain responsible for their own
actual media processing, AI requests, timeline manipulation, captions,
audio processing and export operations.

This keeps the architecture modular and prevents one universal layer
from damaging specialized media functionality.

## Production Goal

One simple command should be able to initiate a complete workflow,
while the system automatically determines the required path.
