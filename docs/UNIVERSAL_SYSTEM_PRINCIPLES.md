# VidoAI Universal System Principles

## Objective

Application features should not be tightly coupled to one specific:

- database
- data-processing pipeline
- AI provider
- storage implementation
- media processor
- external service
- compute implementation

Instead:

APPLICATION INTENT
        ↓
UNIVERSAL CORE
        ↓
CAPABILITY / ADAPTER
        ↓
AVAILABLE RESOURCE
        ↓
RESULT
        ↓
AGGREGATION / STORAGE

## Automatic selection

The core should select an available compatible capability automatically.

The application should ask:

"What needs to be done?"

rather than:

"Which specific processor/database/service must I call?"

## Resource independence

The architecture should remain portable across:

- development
- Codespaces
- desktop
- mobile
- web
- future backend environments

## Important limitation

The application still depends on fundamental physical/system resources such
as CPU, RAM, storage and network when a task requires them.

The goal is to remove unnecessary application-level dependencies and manual
orchestration, not to violate physical or operating-system requirements.

## Safety

Never silently:
- delete data
- overwrite important state
- expose secrets
- bypass authorization
- execute destructive operations

Always preserve recoverability and validation.
