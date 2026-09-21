# Best Option Selection Intelligence

## Purpose

Select the most suitable available option for the current goal,
constraints and evidence.

## Decision model

OPTIONS
-> GOAL
-> CONSTRAINTS
-> ELIGIBILITY
-> EVIDENCE
-> EXPERIENCE
-> SIMULATION
-> RISK
-> MULTI-CRITERIA EVALUATION
-> VERIFICATION
-> SELECTION
-> EXECUTION
-> OUTCOME
-> LEARNING

## Evaluation criteria

- Goal fit
- Correctness
- Safety
- Reliability
- Evidence
- Experience
- Expected benefit
- Time cost
- Resource cost
- Complexity
- Risk
- Reversibility

## Important distinction

"Best" is contextual.

The system must not assume that the fastest, cheapest, largest,
or most powerful option is automatically best.

The selected option should be the best fit for the defined objective
and constraints.

## No safe option

If no candidate passes the minimum correctness and safety gates,
the system returns no selection instead of forcing a choice.

## Learning

After execution:

EXPECTED RESULT
-> ACTUAL RESULT
-> VERIFY
-> COMPARE
-> UPDATE DECISION MEMORY
-> IMPROVE FUTURE OPTION SELECTION

Experience improves future choices but does not override new evidence.
