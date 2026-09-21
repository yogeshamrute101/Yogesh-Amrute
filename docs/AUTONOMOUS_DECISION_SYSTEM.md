# VidoAI Autonomous Decision System

The decision pipeline is:

OBSERVE
  -> UNDERSTAND
  -> COLLECT EVIDENCE
  -> CHECK RULES
  -> CHECK RISK
  -> EVALUATE
  -> CONCLUDE
  -> VERIFY
  -> LEARN

## Decision principles

1. Evidence before conclusion.
2. Context before classification.
3. Safety before irreversible action.
4. Uncertainty must remain explicit.
5. Conflicting evidence must not be hidden.
6. High-risk or irreversible actions require human approval.
7. Verified outcomes may be aggregated for future reasoning.

## Good / Bad

"GOOD" and "BAD" are contextual classifications, not universal truths.

The engine evaluates:
- stated goal
- available evidence
- safety constraints
- applicable rules
- observed risks
- confidence
- consequences

If evidence is insufficient, the system returns:
UNCERTAIN / NEEDS_REVIEW

It must not manufacture certainty.

## Autonomous operation

The system may independently:
- observe
- compare evidence
- detect risks
- classify outcomes
- generate conclusions
- verify results
- learn from validated outcomes

For destructive, dangerous, irreversible, or high-impact operations,
human approval remains required.
