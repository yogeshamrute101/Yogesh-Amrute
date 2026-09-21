# Physical AI Architecture

HUMAN
↓
HUMAN-COMPUTER COMMAND
↓
CENTRAL COMPUTER / MASTER MIND
├── WORLD MODEL
├── MEMORY
├── RESEARCH
├── DECISION
├── SAFETY
└── PLANNING
↓
SUPERCOMPUTER
├── AI COMPUTATION
├── SIMULATION
├── RESEARCH
├── OPTIMIZATION
└── DATA ANALYSIS
↓
SIMULATION / DIGITAL TWIN
↓
PHYSICAL SAFETY CHECK
↓
HUMANOID ROBOT
↓
SENSORS
↓
OBSERVATION
↓
ACTION
↓
VERIFICATION
↓
LEARNING

## Safety rules

- Emergency stop must remain available.
- High-risk physical actions require explicit authorization.
- Unknown sensor state must not be treated as safe.
- Simulation should precede risky physical execution where practical.
- Every important physical action requires verification.
- The software must never claim that a real robot or supercomputer is connected
  unless an actual hardware/network adapter confirms the connection.
- The current humanoid profile is simulation-only until a real hardware adapter
  is deliberately connected.
