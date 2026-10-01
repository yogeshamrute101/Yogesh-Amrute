# VIDOAI → TALKING ROBOT AI MASTER MIGRATION

You are the lead architect and senior full-stack/AI engineer.

Repository:
yogeshamrute101/Yogesh-Amrute

Current branch:
standalone-migration

MISSION:
Transform the existing VidoAI / AI Video Creator application into a modern multimodal Talking Robot AI platform WITHOUT rebuilding the project from scratch and WITHOUT destroying existing functionality.

FIRST:
1. Inspect the complete repository.
2. Understand the existing frontend/backend architecture.
3. Find UniversalCore, MasterAgent, ToolBus, MemoryEngine, ResearchEngine, PermissionManager, VerificationEngine, Copilot, Reel Maker, Timeline, Captions, Audio, Effects and Export.
4. Detect merge conflicts, duplicate code, broken imports, TODO/mock/fake implementations, disconnected frontend/backend operations and TypeScript/build errors.
5. Create an internal migration plan.
6. Preserve working functionality.

TARGET PRODUCT:

A user should be able to interact with a Talking Robot AI using text or voice.

Flow:

TEXT/VOICE
↓
STT when voice is used
↓
AI AGENT
↓
Understand
↓
Plan
↓
Permission
↓
Execute
↓
Verify
↓
Memory
↓
Response
↓
TTS
↓
Talking Robot Avatar

Implement:

- Talking robot avatar
- Listening state
- Thinking state
- Speaking state
- Working state
- Success/error states
- Microphone input
- Speech-to-text abstraction
- Text-to-speech abstraction
- Lip-sync/avatar abstraction
- Text chat fallback
- Image input
- Document input
- Video input
- Project memory
- Research
- AI actions
- Video generation workflow
- Existing VidoAI editor integration
- Captions
- Audio
- Effects
- Timeline
- Export
- Authentication
- Error recovery
- Permission controls
- Provider abstraction

IMPORTANT:
Do not create a second competing AI brain.

Reuse the existing UniversalCore/MasterAgent/ToolBus architecture wherever possible.

Create modular interfaces for:

LLM
STT
TTS
Image generation
Video generation
Avatar/lip-sync
Research/search

Never expose API keys in frontend code.

ROBOT COMMAND EXAMPLES:

"Create a 60 second video explaining drug discovery."

"Research this PDF."

"Summarize this document."

"Turn this research into a video."

"Add captions."

"Make this video vertical."

"Remove the first 5 seconds."

"Create a Reel."

"Export the video."

These must execute real backend/editor operations when the required capability exists. Never return fake success.

VIDEO FLOW:

User request
→ understand
→ research if required
→ generate script
→ generate narration/media
→ assemble timeline
→ captions
→ verify
→ preview
→ export

EDITOR COMMAND FLOW:

Robot
→ structured action
→ permission check
→ editor operation
→ verification
→ UI update

Keep the existing navigation and functionality:

Home
New Project
Editor
AI
Captions
Audio
Settings
Projects

Modernize the interface so the primary experience is:

Talking Robot
+
Conversation
+
Create/Research/Work actions
+
Existing powerful video editor

Use progressive disclosure so the interface does not become cluttered.

Do not expose private chain-of-thought.
Show only concise action/status information such as:

Understanding request...
Planning...
Generating...
Checking...
Completed.

SECURITY:

- No arbitrary shell execution from user prompts.
- Protect API keys.
- Validate uploaded files.
- Use permission controls for external actions.
- Protect authenticated projects.
- Handle prompt injection safely.
- Do not claim success without verified execution.

ERROR RECOVERY:

For major operations:

execute
→ verify

On failure:

diagnose
→ safe retry
→ fallback
→ report actual error

Never hide failures.

IMPLEMENTATION RULES:

1. Do not delete working features.
2. Do not rebuild the project from zero.
3. Do not create fake buttons.
4. Do not hardcode AI responses.
5. Do not hardcode API keys.
6. Do not expose secrets.
7. Do not silently change user commands.
8. Keep Android/Capacitor compatibility.
9. Keep mobile responsive.
10. Prefer existing modules over duplicate modules.
11. Make frontend/backend communication real.
12. Make the application buildable at every stage.
13. Do not stop after creating a plan; implement the maximum feasible portion.
14. If an external provider/key is required, implement the provider interface and clearly identify the required environment variable.
15. Fix existing build/lint errors encountered during migration.

VALIDATION:

Run:

npm install
npm run lint
npm run build

Also verify:

- app startup
- robot text interaction
- microphone handling
- STT integration
- TTS integration
- avatar states
- document upload
- image input
- project creation
- editor commands
- captions
- audio
- export
- authentication
- error recovery
- mobile layout

Before modifications create a git checkpoint.

At the end provide:

1. Files changed
2. Features implemented
3. Provider/API credentials required
4. Tests executed
5. npm run lint result
6. npm run build result
7. Remaining blockers
8. Exact next command

START NOW.

Do not wait for confirmation between implementation phases.


## AUTONOMOUS EXECUTION MODE — IMPORTANT

DO NOT WAIT FOR USER CONFIRMATION BETWEEN PHASES.

After starting:
1. Inspect the repository.
2. Create the safety checkpoint.
3. Audit the architecture.
4. Implement the migration.
5. Run validation.
6. Fix discovered errors.
7. Continue automatically to the next phase.
8. Repeat until all feasible phases are completed.

Do NOT ask:
"Should I continue?"
"Do you want me to proceed?"
"Shall I implement the next phase?"
"Confirm before editing."

Only stop when:
- the requested implementation is completed as far as technically possible,
- a genuinely required external credential/access is missing,
- an irreversible destructive action would be required,
- or the environment prevents further execution.

For ordinary coding decisions, make the safest reasonable decision and continue.

If one feature is blocked by a missing external provider/API key:
- implement everything else that can be implemented,
- create the provider adapter,
- add the required environment-variable configuration,
- continue with all independent phases,
- report the blocker at the end.

Do not stop merely because one phase encounters an error.
Diagnose → fix → validate → continue.

The goal is an autonomous end-to-end migration, not a phase-by-phase consultation.

# AUTONOMOUS EXECUTION — MANDATORY

START NOW AND CONTINUE WITHOUT USER CONFIRMATION.

Do NOT stop between phases.
Do NOT ask for Y/N.
Do NOT ask "Should I continue?"
Do NOT ask "Do you want me to proceed?"
Do NOT wait for approval before editing files.

Execute the complete migration autonomously:

1. Inspect repository
2. Create safety checkpoint
3. Audit architecture
4. Fix existing blocking errors
5. Implement Talking Robot architecture
6. Implement robot UI/avatar states
7. Implement voice/STT/TTS provider abstractions
8. Connect robot to existing UniversalCore/MasterAgent/ToolBus
9. Implement multimodal input
10. Implement research/document workflow
11. Connect robot to VidoAI video creation
12. Connect robot to existing editor
13. Implement structured editor actions
14. Implement project memory
15. Implement authentication preservation
16. Implement permissions/security
17. Implement error recovery
18. Run lint
19. Run build
20. Fix errors automatically
21. Run validation again
22. Continue until all feasible work is complete
23. Produce final implementation report

IMPORTANT:
If one component is blocked by an unavailable API key/provider, DO NOT stop the entire migration.

Instead:
- implement the provider abstraction,
- connect the available provider(s),
- add environment-variable configuration,
- continue every independent task,
- report the external dependency at the end.

Only stop if:
- the environment technically prevents further work,
- a destructive irreversible operation is required,
- or all feasible implementation work is complete.

Never claim that something succeeded unless it was actually executed and verified.

Do not expose private chain-of-thought.
Show concise action/status summaries only.

At completion run:

git status
npm run lint
npm run build

Then provide:
- files changed
- features implemented
- APIs/providers required
- tests performed
- lint result
- build result
- remaining blockers
- exact next command if anything remains

DO NOT WAIT FOR CONFIRMATION.
CONTINUE AUTOMATICALLY UNTIL COMPLETE.
