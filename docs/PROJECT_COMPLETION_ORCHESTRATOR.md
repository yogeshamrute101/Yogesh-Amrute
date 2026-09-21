# Project Completion Orchestrator

The orchestrator coordinates safe project-completion work.

Parallel discovery:
- source inventory
- documentation inventory
- Git status

Validation pipeline:
1. TypeScript validation
2. Production build
3. Health/status recording

Rules:
- Do not overwrite existing application architecture automatically.
- Do not delete files automatically.
- Do not bypass authentication or permissions.
- Do not claim a capability is operational merely because its UI exists.
- Failed validation stops completion.
- Existing application code remains the source of truth.
- High-impact changes require explicit review/approval.

This is an orchestration and validation layer, not an unrestricted autonomous
computer-control system.
