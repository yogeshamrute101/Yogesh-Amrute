# Restricted Capability Security

High-risk capabilities are protected by multiple layers:

1. Authentication
2. Authorization
3. Explicit user approval
4. Audit logging
5. Safety policy
6. Safe-mode / emergency stop

The owner key is an authentication factor, not a bypass of safety rules.

Protected harmful capabilities remain blocked even when the owner key
is supplied.

Configure the authentication secret outside source code:

VIDOAI_OWNER_KEY=<strong-secret>

Never commit the secret to Git, source files, logs, screenshots,
frontend code, or public repositories.
