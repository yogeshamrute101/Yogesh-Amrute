# System Integrity & Missing Capability Framework

The system must continuously check itself instead of assuming that the
architecture is complete.

## Additional capabilities identified

### 1. Security
Authentication, authorization, least privilege, sandboxing, secret protection,
dependency scanning and secure execution.

### 2. Privacy
Data minimization, consent, access control, retention and protected storage.

### 3. Human Control
Approval, emergency stop, override, escalation and recovery.

### 4. Reliability
Retries, timeouts, circuit breakers, graceful degradation and verification.

### 5. Recovery
Snapshots, backup, rollback, disaster recovery and continuity testing.

### 6. Observability
Logs, metrics, traces, health checks, incident records and audit trails.

### 7. Data Provenance
Source, timestamp, confidence, freshness, transformation history and evidence.

### 8. Knowledge Quality
Fact/inference/hypothesis separation, uncertainty and contradiction detection.

### 9. Resource Management
CPU, RAM, storage, network, API quotas and workload prioritization.

### 10. Testing
Unit, integration, regression, security, performance and safety tests.

### 11. Interoperability
Adapters for APIs, files, devices, services and future platforms.

### 12. Accessibility
Human-friendly interaction across language, voice, text and accessible UI.

### 13. Incident Management
Detect → contain → recover → verify → document → learn.

### 14. Capability Registry
The system must know which capabilities actually exist, which are unavailable,
and which require authorization.

### 15. Continuous Integrity
After major changes:
AUDIT → TEST → VERIFY → REPORT → IMPROVE.

## Important limitation

The system must never claim to know, see, hear, control or access something
unless an actual data source, sensor, connector, permission or capability
provides it.
