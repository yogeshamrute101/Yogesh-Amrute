# VidoAI Universal Operation System

## Supported operations

ADD, SUBTRACT, REMOVE, REPLACE, UPDATE, INSERT, DELETE, MERGE, SPLIT,
MOVE, COPY, CLONE, RENAME, REORDER, SORT, FILTER, MAP, REDUCE,
TRANSFORM, CONVERT, FORMAT, NORMALIZE, COMPARE, DIFF, PATCH,
ROLLBACK, RESTORE, DUPLICATE, DEDUPLICATE, ENABLE, DISABLE,
CONNECT, DISCONNECT, IMPORT, EXPORT, CREATE, ARCHIVE, UNARCHIVE,
VALIDATE, VERIFY, SIMULATE.

## Operation lifecycle

REQUEST
→ UNDERSTAND
→ IDENTIFY TARGET
→ CHECK PERMISSION
→ PREVIEW
→ VALIDATE
→ AUTHORIZE
→ APPLY
→ VERIFY
→ ROLLBACK IF REQUIRED
→ AUDIT

## Domains

The same operation contract can be adapted to:

- TEXT
- DOCUMENT
- CODE
- FILE
- DATA
- DATABASE
- IMAGE
- VIDEO
- AUDIO
- CAPTION
- PROJECT
- CONFIGURATION
- AI WORKFLOW
- SYSTEM COMPONENT

Actual support depends on a registered adapter for that domain.

## Safety

The engine does not grant unrestricted modification access.
Destructive or high-impact operations require appropriate authorization,
and successful execution is not considered complete until verification passes.

## Important

The existence of this engine does not mean every domain is already connected.
Each domain requires a tested adapter.
