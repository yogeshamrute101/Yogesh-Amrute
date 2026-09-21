# FULL PROJECT ERROR AUDIT — DO NOT MODIFY CODE

You are auditing the existing AI Video Creator / VidoAI project.

IMPORTANT:
- Do NOT restart or rebuild the project from scratch.
- Do NOT delete existing files.
- Do NOT rewrite working features.
- Do NOT make speculative fixes.
- This is an AUDIT ONLY. Do not modify source code.
- Inspect the EXISTING implementation and report every real error you can identify.

PROJECT GOAL:
Find all current and potential errors in the existing application and classify them clearly.

AUDIT EVERYTHING:

1. PROJECT STRUCTURE
- Inspect package.json
- Inspect tsconfig files
- Inspect Vite configuration
- Inspect Capacitor configuration
- Inspect server.ts
- Inspect src/
- Inspect server/
- Inspect server/ai/
- Inspect existing core/universal files
- Check for duplicate, backup, unused or conflicting implementations

2. TYPESCRIPT / JAVASCRIPT
- Run TypeScript type checking
- Find compilation errors
- Find invalid imports/exports
- Find missing files
- Find wrong paths
- Find undefined variables/functions
- Find incompatible types
- Find async/await problems
- Find incorrect interfaces/types
- Find unreachable or broken code

3. FRONTEND
Inspect all screens/components/services.
Check:
- React errors
- broken props
- state management problems
- missing callbacks
- navigation errors
- modal/button errors
- rendering errors
- event-handler errors
- broken imports
- missing keys
- stale state
- race conditions
- browser-only APIs
- mobile/Capacitor compatibility

4. BACKEND
Inspect:
- Express server
- API routes
- request/response formats
- error handling
- CORS
- static serving
- SPA fallback
- environment variables
- port handling
- production build
- API/frontend mismatch

5. AI / COPILOT
Inspect:
- GeminiProvider
- AI Co-Pilot
- CoPilotPanel
- AiCoPilotModal
- Reel Maker
- brain.ts
- researcher.ts
- knowledge.ts
- safety.ts
- idea-engine.ts
- project-search.ts
- evolution.ts
- universal core / Copilot bridge

Check:
- API key/configuration
- endpoint mismatch
- timeout handling
- 401/403
- 429 quota
- network errors
- malformed AI responses
- schema mismatch
- validator/parser mismatch
- frontend/backend contract mismatch
- fallback behavior

6. REEL MAKER
Verify the complete flow:
UI → request → API → backend → AI/core → response → parser/validator → timeline/UI.

7. CAPTIONS
Inspect the current Captions implementation.
Check:
- caption state
- editing
- deleting
- adding
- style handling
- timeline synchronization
- callbacks
- empty-state behavior
- TypeScript errors
- navigation back to editor

8. EDITOR / TIMELINE
Check:
- timeline state
- clips
- playhead
- playback
- playback speed
- editing operations
- undo/redo if present
- audio
- effects
- export
- synchronization issues

9. DEPENDENCIES
Check package.json/package-lock.json for:
- missing dependencies
- unused dependencies
- version conflicts
- incompatible packages
- scripts that do not work

10. BUILD / RUN
Actually run safe diagnostic commands where possible:
- npm install consistency check
- npm run lint
- npm run build
- other existing test/typecheck commands

Do NOT change files while running diagnostics.

11. ENVIRONMENT
Check .env.example and code references for:
- missing environment variables
- inconsistent variable names
- secrets accidentally hardcoded
- frontend/backend environment mismatch

Do NOT expose secret values in the report.

12. GIT / FILE CONSISTENCY
Check for:
- accidentally generated files
- conflicting versions
- duplicate implementations
- backup files being imported accidentally
- untracked files that are required
- tracked files referencing missing untracked files

13. ERROR CLASSIFICATION

For EVERY discovered issue, classify it as:

CRITICAL = app cannot start/build or major functionality is broken
HIGH = major feature broken
MEDIUM = feature works partially or has important runtime risk
LOW = minor bug, cleanup or maintainability issue
INFO = observation, not an actual error

14. OUTPUT FORMAT

Create a report named:

FULL_ERROR_AUDIT_REPORT.md

Use this structure:

# VidoAI Full Error Audit

## 1. Executive Summary
- Total errors
- Critical
- High
- Medium
- Low
- Info

## 2. Build / TypeScript Errors

For each:
- ID
- Severity
- File
- Line
- Exact error
- Root cause
- Evidence
- Suggested fix
- Whether fix is safe

## 3. Frontend Errors

## 4. Backend Errors

## 5. AI / Copilot Errors

## 6. Reel Maker Errors

## 7. Captions Errors

## 8. Editor / Timeline Errors

## 9. Dependency Errors

## 10. Environment / Configuration Errors

## 11. Git / File Structure Issues

## 12. Runtime Risks

## 13. Duplicate / Conflicting Implementations

## 14. Fix Order

Give the safest repair order:
1. Critical
2. High
3. Medium
4. Low

DO NOT fix anything yet.

At the end provide:

## FINAL STATUS

BUILD STATUS:
TYPECHECK STATUS:
FRONTEND STATUS:
BACKEND STATUS:
AI/COPILOT STATUS:
REEL MAKER STATUS:
CAPTIONS STATUS:
EDITOR STATUS:
EXPORT STATUS:

## IMPORTANT
Only report errors supported by actual code, command output, or clear evidence.
Do not invent errors.
Separate confirmed errors from possible risks.
