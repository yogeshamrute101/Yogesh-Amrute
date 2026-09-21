# Reversible Step & Instruction Control

## Normal flow

READ INSTRUCTIONS
-> UNDERSTAND
-> PLAN
-> CHECK DEPENDENCIES
-> EXECUTE
-> CHECKPOINT
-> VERIFY
-> CONTINUE

## Correction flow

ERROR / VIOLATION
-> IDENTIFY
-> CHECK INSTRUCTIONS
-> RETURN TO VERIFIED CHECKPOINT
-> CORRECT
-> REEXECUTE
-> VERIFY
-> CONTINUE

## Important behavior

The system should not blindly continue after an instruction violation.
It should distinguish:

- normal retry
- correction
- rollback
- re-execution
- clarification
- safe stop

Every rollback/correction should remain traceable.

The controller is an execution-control framework. Actual rollback of
external software, devices, files or physical systems requires the
appropriate adapter, authorization, checkpoint/state support and safety
controls.
