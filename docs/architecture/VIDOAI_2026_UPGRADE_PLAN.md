# VIDOAI 2026 Upgrade Plan

## Product Direction

VIDOAI should evolve from an AI-assisted video editor into a
multimodal agentic creation platform.

## Required layers

### 1. Agent Control Plane
- Master agent
- specialist agents
- delegation
- task lifecycle
- background execution
- cancellation
- retry
- checkpoints
- human approval

### 2. Capability / Tool Plane
Capabilities must be registered through one execution interface.

Core capabilities:
- research
- script
- image generation
- video generation
- voice
- transcription
- captions
- timeline editing
- effects
- audio
- export
- project persistence
- web research
- file ingestion

No fake success.
Every capability must return:
- accepted
- running
- completed
- failed
- cancelled
- evidence

### 3. Multimodal Context Plane
One task may contain:
- text
- image
- video
- audio
- documents
- timeline state
- project metadata

### 4. Workflow Builder
Add a visual workflow graph:
Input -> Agent -> Tool -> Condition -> Agent -> QA -> Output

Support:
- branching
- retries
- parallel agents
- dependencies
- schedules
- reusable workflows
- workflow templates
- publish/share

### 5. Prompt-to-App Builder
User prompt should be able to create:
- workflow
- UI
- API contract
- project schema
- agent configuration
- permissions
- test cases

Generated apps must remain inside a controlled runtime.
Never execute arbitrary shell commands from user prompts.

### 6. Model Router
Introduce a provider abstraction:
task -> capability -> model/provider

Do not hard-code the product around one model.

### 7. Verification Plane
Every autonomous task must have:
- plan
- execution
- observation
- validation
- evidence
- recovery

### 8. Provenance
Persist:
- provider
- model
- prompt hash/version
- creation timestamp
- source assets
- generated assets
- transformations
- workflow version

### 9. Adaptive UI
The interface should expose the next useful action based on
the current project/task instead of displaying every control at once.

### 10. Preserve Existing Product
Do NOT remove or rewrite:
- Copilot
- Reel Maker
- Timeline
- Captions
- Audio
- Effects
- Export
- Projects
- Settings

Integrate the new architecture around them.

## Priority

P0:
Agent execution truth
Tool/capability registry
Task lifecycle
Permissions
Verification
Recovery

P1:
Multimodal context
Model routing
Background jobs
Workflow graph

P2:
Prompt-to-app builder
Workflow publishing
Agent marketplace/registry
Advanced adaptive UI

## Definition of Done

A feature is not complete because a component exists.

It is complete only when:
1. UI can invoke it.
2. Backend receives it.
3. Execution layer performs it.
4. Result is persisted.
5. UI observes the result.
6. Failure is recoverable.
7. Permission boundaries exist.
8. Tests/typecheck/build pass.
9. No placeholder success is returned.

## Engineering Rules

- Never fabricate provider execution.
- Never expose API keys to the client.
- Never execute arbitrary shell commands from AI output.
- Never claim success without evidence.
- Never introduce infinite autonomous loops.
- Keep existing VIDOAI editing functionality working.
- Prefer additive architecture over destructive rewrites.
