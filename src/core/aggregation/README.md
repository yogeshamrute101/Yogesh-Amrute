# VidoAI Universal Aggregation Core

## Purpose

Create a universal aggregation layer for VidoAI.

Conceptual model:

Atomic units
    ↓
Aggregation
    ↓
Relations
    ↓
Knowledge/Project State
    ↓
Persistent Storage
    ↓
Recovery / Validation

The electron/proton analogy is conceptual only:
small validated units combine into larger stable structures.

This system must NOT copy raw data blindly.

Every aggregated item should have:

- unique ID
- source
- type
- content/reference
- timestamp
- version
- relations
- confidence/status
- validation state
- privacy classification

## Core principles

1. Collect
2. Normalize
3. Validate
4. Aggregate
5. Relate
6. Persist
7. Retrieve
8. Version
9. Recover

Never overwrite important historical state without versioning.

Never store secrets in the aggregation layer.

Never invent data.

Existing project data remains authoritative.
