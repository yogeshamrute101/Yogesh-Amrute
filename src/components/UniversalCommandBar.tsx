import { useEffect, useState } from "react";
import {
  registerExistingFeatures,
  routeUniversalCommand,
} from "../core/universal";

export default function UniversalCommandBar() {
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    registerExistingFeatures();
  }, []);

  async function execute() {
    const value = command.trim();

    if (!value) return;

    setStatus("Understanding and routing...");
    setResult(null);

    try {
      const response = await routeUniversalCommand(value);

      setResult(response);
      setStatus(
        response.success
          ? `Completed via ${response.selectedFeature}`
          : "Needs recovery or feature connection"
      );
    } catch (error) {
      setStatus("System recovered from an unexpected error.");
      setResult({ success: false, error: String(error) });
    }
  }

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h2>Universal Command</h2>

      <p>
        Give VidoAI one command. The system identifies the required
        capability and routes the work automatically.
      </p>

      <textarea
        value={command}
        onChange={event => setCommand(event.target.value)}
        placeholder="Example: Make a 30 second viral Reel with captions and music"
        rows={4}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 12,
          resize: "vertical",
        }}
      />

      <button
        onClick={execute}
        disabled={!command.trim()}
        style={{
          marginTop: 10,
          padding: "12px 24px",
          cursor: command.trim() ? "pointer" : "not-allowed",
        }}
      >
        Execute
      </button>

      {status && (
        <div style={{ marginTop: 16 }}>
          <strong>{status}</strong>
        </div>
      )}

      {result && (
        <pre
          style={{
            marginTop: 12,
            padding: 16,
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
