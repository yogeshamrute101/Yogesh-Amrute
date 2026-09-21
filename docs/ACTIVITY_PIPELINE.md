# Activity Pipeline

Input sources are adapters.

Camera/video -> WATCH
Document/image/UI -> READ
Microphone/audio -> HEAR

All adapters produce PerceptionInput.

PerceptionInput
    |
    v
MultimodalPerception
    |
    v
ActivityUnderstanding
    |
    v
ActivityConclusion
    |
    v
Aggregation
    |
    v
AutonomousMind
