import { useState } from "react";
import {
  executeMasterCommand,
  getMasterSystemState,
} from "../core/universal/MasterCommand";

export default function MasterCommandCenter() {
  const [command, setCommand] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);

  async function run() {
    const value = command.trim();

    if (!value || busy) return;

    setBusy(true);
    setMessage("Working...");
    setResult(null);

    try {
      const response = await executeMasterCommand(value);

      setResult({
        response,
        system: getMasterSystemState(),
      });

      setMessage(
        response.success
          ? "Completed and verified."
          : "Recovery required."
      );
    } catch (error) {
      setMessage("System handled an unexpected error.");
      setResult({
        success: false,
        error: String(error),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <h2>VidoAI Command Center</h2>

      <p>
        Give one command. VidoAI plans the work, skips unnecessary
        steps, executes the required flow and verifies the result.
      </p>

      <textarea
        rows={5}
        value={command}
        onChange={e => setCommand(e.target.value)}
        placeholder="Example: Create a 30 second Reel with captions and music"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <button
        onClick={run}
        disabled={busy || !command.trim()}
        style={{
          marginTop: 12,
          padding: "12px 24px",
          borderRadius: 8,
        }}
      >
        {busy ? "Processing..." : "Run Command"}
      </button>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {result && (
        <pre
          style={{
            padding: 16,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            borderRadius: 8,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
