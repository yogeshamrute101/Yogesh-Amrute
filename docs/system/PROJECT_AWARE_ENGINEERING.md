# Project-Aware Engineering System

The system maintains a structured understanding of its own project context.

## Responsibilities

- Understand project structure
- Track modules and capabilities
- Track lint/build/test state
- Remember known errors and fixes
- Record engineering events
- Distinguish terminal output from executable commands
- Inspect evidence before proposing fixes
- Prefer minimal changes
- Verify changes after modification
- Avoid destructive commands unless explicitly authorized
- Track what is created versus actually integrated and verified

## Engineering Loop

DISCOVER
→ UNDERSTAND
→ REMEMBER
→ VERIFY
→ DIAGNOSE
→ PLAN
→ ACT
→ TEST
→ RECORD
→ LEARN

## Command Safety

Commands are classified as:

- read-only
- workspace-change
- destructive
- external
- unknown

Unknown or high-risk commands require explicit authorization before execution.

## Reality Boundary

A file existing in the repository does not prove that a capability is operational.

A capability should progress through:

MISSING
→ PLANNED
→ BUILDING
→ INTEGRATED
→ TESTING
→ VERIFIED
→ PRODUCTION
