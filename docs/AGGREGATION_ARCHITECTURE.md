# VidoAI Aggregation Architecture

The system uses an electron/proton-inspired conceptual model:

Small validated information units
→ aggregation
→ relationships
→ larger knowledge/project structures
→ persistent storage.

This is an architectural analogy, not a claim that software behaves like
particle physics.

## Data lifecycle

INPUT
→ NORMALIZE
→ VALIDATE
→ AGGREGATE
→ RELATE
→ SAVE
→ VERSION
→ RETRIEVE
→ RECOVER

## Persistence

The aggregation interfaces are intentionally storage-independent.

The in-memory implementation is for development/testing.

A production persistence adapter should be connected later to the project's
chosen durable storage/database after inspecting the existing architecture.

## Safety

Aggregation must not:
- expose secrets
- silently overwrite historical data
- fabricate information
- bypass validation
- destroy existing project state
