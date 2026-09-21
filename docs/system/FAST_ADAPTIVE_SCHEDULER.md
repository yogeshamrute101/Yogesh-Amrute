# Fast Adaptive Work Scheduler

## Goal

Finish useful work as quickly as possible while preserving correctness,
dependencies, safety and traceability.

## Scheduling

CRITICAL
-> DEADLINE
-> HIGH
-> NORMAL
-> BACKGROUND

Within equivalent priority:

FIRST COME
-> FIRST SERVE

Deadline-sensitive work can be promoted when appropriate.

## Decomposition

LARGE TASK
-> SMALL STEPS
-> DEPENDENCY GRAPH
-> INDEPENDENT STEPS
-> PARALLEL EXECUTION

## Step optimization

For every step:

REQUIRED?
-> DEPENDENCY?
-> VALUE?
-> CAN SKIP?
-> CAN MERGE?
-> CAN REPLACE?

Unnecessary steps can be skipped.

A step can be replaced only when the replacement is declared
compatible and does not reduce required correctness or safety.

## Speed

Use:

- parallel execution
- batching
- caching
- streaming
- reuse of existing results
- early completion
- low-latency I/O

The system should minimize latency, but physical speed-of-light or
sound-speed limits do not apply as software performance guarantees.

## Verification

Fast execution does not mean uncontrolled execution.

Critical results still require:

EXECUTE
-> VERIFY
-> COMPLETE

## Integration

This scheduler is intended to coordinate the existing:

- Multi-Tasking Engine
- Universal Everything Loop
- Minimum Effort Engine
- Reversible Step Controller
- Action-Reaction Engine
- Correctness Fabric
- CAPA / Self-Repair
- System Orchestrator
