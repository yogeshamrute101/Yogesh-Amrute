# VidoAI Universal Autonomous Architecture

The existing repository is the source of truth.

CONTINUE — DO NOT RESTART.

The application should minimize unnecessary dependence on specific
data systems, processors, databases, AI providers and external services.

Use the Universal Core abstraction:

USER INTENT
→ UNIVERSAL CORE
→ CAPABILITY DISCOVERY
→ BEST AVAILABLE COMPATIBLE ADAPTER
→ PROCESS
→ VALIDATE
→ AGGREGATE
→ PERSIST
→ RECOVER

Rules:

1. Do not hard-code application logic to one provider when an abstraction
   is practical.

2. Do not create duplicate data-processing systems when an existing
   capability can be reused.

3. Do not require the user to manually select technical infrastructure
   when safe automatic capability selection is possible.

4. Before adding a new processor/database/service, inspect whether the
   existing Universal Core or adapter can perform the task.

5. Keep storage, compute, AI, media processing and external integrations
   behind replaceable adapters where practical.

6. Automatically detect available compatible capabilities.

7. Prefer local/self-contained processing when it is actually available
   and appropriate.

8. Use external services only when the required capability genuinely
   cannot be provided locally.

9. Preserve existing functionality.

10. Never delete or replace working architecture merely to apply this model.

11. Never claim that the application can operate without fundamental
    operating-system resources such as CPU, memory or storage.

12. Validate every automatic change.

13. Preserve data and provide recovery/versioning where appropriate.

14. Never expose credentials or secrets.

15. When a required capability is unavailable, clearly report:
    - required capability
    - available capabilities
    - why the task cannot currently be completed
    - safest next step

The desired property is:

"One application-level intelligence layer that coordinates available
capabilities without forcing the user to understand or manually manage
the underlying technical systems."

END
