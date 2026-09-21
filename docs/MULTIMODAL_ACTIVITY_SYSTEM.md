# VidoAI Multimodal Activity System

The system follows:

WATCH -> READ -> HEAR -> UNDERSTAND -> CORRELATE -> CONCLUDE -> ACT -> VERIFY -> LEARN

## Capabilities

### WATCH
Process visual/video observations through a pluggable vision capability.

### READ
Process text, OCR, documents, UI information and other readable content.

### HEAR
Process speech and audio observations through a pluggable audio capability.

### UNDERSTAND
Normalize different input types into a common perception model.

### CORRELATE
Combine observations using timestamps, source information and available context.

### CONCLUDE
Generate an evidence-based activity conclusion.

Every conclusion must contain:
- evidence
- source input IDs
- confidence
- uncertainty
- timestamp

The system must never treat an unsupported inference as confirmed fact.

### ACT
The Autonomous Mind may plan or execute actions only through available capabilities and applicable safety/approval rules.

### VERIFY
Actions and conclusions should be checked against resulting evidence.

### LEARN
Only validated results should be aggregated into long-term project knowledge.

## Architecture

UniversalCore
  -> MultimodalPerception
  -> ActivityUnderstanding
  -> Aggregation
  -> AutonomousMind

The implementation is capability-based and does not hard-code a specific camera,
microphone, OCR engine, AI provider, database, or cloud service.
