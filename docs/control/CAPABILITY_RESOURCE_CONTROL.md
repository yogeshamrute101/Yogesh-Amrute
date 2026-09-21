# Capability & Resource Control

## Control Flow

REQUEST
↓
IDENTIFY CAPABILITY
↓
IDENTIFY RESOURCE
↓
CHECK PERMISSION
↓
CHECK SAFETY
↓
CHECK LIMIT
↓
ALLOW / DENY / LIMIT / APPROVAL
↓
EXECUTE
↓
MONITOR USAGE
↓
VERIFY
↓
RELEASE RESOURCES
↓
AUDIT

## Controlled areas

- CPU
- Memory
- Storage
- Network
- APIs
- Databases
- Applications
- Devices
- Robots
- User data
- Connected systems

## Control levels

OBSERVE
SUGGEST
REQUEST
EXECUTE
ADMIN

## Principles

1. Strong control must be policy-based.
2. Least privilege is the default.
3. User-owned resources require authorization.
4. High-impact operations require approval.
5. Resource limits prevent runaway workloads.
6. Emergency safe mode can disable capabilities.
7. Every important control decision is auditable.
8. The system must distinguish capability from permission.
9. The system must never claim control it does not actually have.
