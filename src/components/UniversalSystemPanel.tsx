import { useState } from "react";
import { runUniversalCommand } from "../core/universal/UniversalCopilotBridge";
import { verifySystemIntegrity } from "../core/universal/verification/SystemVerifier";

export default function UniversalSystemPanel() {
  const [command, setCommand] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function run() {
    if (!command.trim() || running) return;

    setRunning(true);

    try {
      const response = await runUniversalCommand(command);
      setResult({
        response,
        verification: verifySystemIntegrity(),
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>VidoAI Universal System</h1>

      <p>
        One simple command → plan → execute → verify → recover → learn.
      </p>

      <textarea
        value={command}
        onChange={e => setCommand(e.target.value)}
        placeholder="Tell VidoAI what you want to accomplish..."
        rows={5}
        style={{ width: "100%", padding: 12 }}
      />

      <button
        onClick={run}
        disabled={running || !command.trim()}
        style={{ marginTop: 12, padding: "12px 20px" }}
      >
        {running ? "Working..." : "Run"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: 20,
            padding: 16,
            overflow: "auto",
            borderRadius: 8,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
