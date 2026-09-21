# VidoAI Autonomous OS

The Autonomous OS is a control layer above the existing VidoAI
application.

## Flow

Command
→ Goal understanding
→ Task decomposition
→ Deduplication
→ Priority queue
→ Execution
→ Verification
→ Recovery
→ Experience
→ Completion

## Components

### Planner
Breaks goals into manageable tasks.

### Queue
Prioritizes work and uses creation time as a tie breaker.

### Workflow
Coordinates complete task execution.

### Agents
Provides planner/researcher/executor/verifier/recovery/learner roles.

### Recovery
Retries recoverable failures and records failed outcomes.

### Experience
Stores reusable lessons.

### Observability
Records system events.

### Release
Provides release-check reporting.

## Safety principle

The Autonomous OS does not delete or replace existing VidoAI
feature implementations. It provides orchestration around them.

Actual feature execution should use registered existing application
handlers.
