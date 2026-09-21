# Universal Multi-Project Orchestration

## Goal

Allow the system to manage an extensible number of projects while
executing as many tasks concurrently as available resources safely
allow.

## Architecture

PROJECT REGISTRY
-> PROJECT ISOLATION
-> PRIORITY QUEUE
-> TASK DECOMPOSITION
-> DEPENDENCY GRAPH
-> RESOURCE SCHEDULER
-> PARALLEL EXECUTION
-> MONITORING
-> CHECKPOINT
-> VERIFICATION
-> RECOVERY
-> COMPLETION
-> RESOURCE RELEASE

## Project independence

Each project has:

- project ID
- project state
- task graph
- execution state
- checkpoint
- resource boundary
- data boundary
- recovery state

A failure in one project should be isolated where possible.

## Infinite concept

The registry is designed without a fixed hardcoded maximum number
of logical projects.

However, actual execution cannot be literally infinite. CPU, RAM,
GPU, storage, network bandwidth, operating-system limits and external
services constrain simultaneous execution.

Therefore the system uses:

QUEUE
-> BATCH
-> PARALLEL EXECUTION
-> RESOURCE RELEASE
-> NEXT BATCH

This allows large project populations to be continuously processed.

## Fast execution

Independent projects and tasks can run concurrently.

Dependent tasks wait for their prerequisites.

## Completion

When a project is verified complete:

COMPLETE
-> SAVE RESULT
-> SAVE EXPERIENCE
-> RELEASE RESOURCES
-> REMOVE FROM ACTIVE QUEUE

The system can immediately allocate released resources to waiting work.
