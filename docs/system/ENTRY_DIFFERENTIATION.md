# Entry Differentiation System

The system must distinguish:

EXISTING
NEW
MODIFIED
DUPLICATE
MISSING
UNKNOWN
NEEDS_REVIEW

Core flow:

IDENTIFY
→ CLASSIFY
→ MATCH
→ DIFFERENTIATE
→ LINK
→ DEDUPLICATE
→ TRACK

Every entry should have a stable identity where possible.

The system must not assume that similar names mean identical entities.
When evidence is insufficient, it should use NEEDS_REVIEW or UNKNOWN.

Existing entries should not be silently overwritten.
Changes should remain traceable through identity, version and history.
