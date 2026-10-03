import React from "react";

export interface GenerationStatusProps {
  status?: "idle" | "queued" | "processing" | "completed" | "failed";
  message?: string;
  progress?: number;
}

export const GenerationStatus: React.FC<GenerationStatusProps> = ({
  status = "idle",
  message,
  progress,
}) => {
  const safeProgress =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, progress))
      : undefined;

  return (
    <section
      aria-label="Generation status"
      data-testid="generation-status"
      style={{ padding: 12, borderRadius: 12 }}
    >
      <strong>{status}</strong>

      {message && <div>{message}</div>}

      {safeProgress !== undefined && (
        <progress value={safeProgress} max={100}>
          {safeProgress}%
        </progress>
      )}
    </section>
  );
};

export default GenerationStatus;
