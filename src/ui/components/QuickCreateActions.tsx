import React from "react";

export interface QuickCreateActionsProps {
  onCreate?: (mode: string) => void;
}

const modes = [
  "Video",
  "Movie",
  "Documentary",
  "Live Show",
  "Image",
  "Build App",
];

export const QuickCreateActions: React.FC<QuickCreateActionsProps> = ({
  onCreate,
}) => (
  <section
    aria-label="Quick create"
    data-testid="quick-create-actions"
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
    }}
  >
    {modes.map((mode) => (
      <button
        key={mode}
        type="button"
        onClick={() => onCreate?.(mode)}
      >
        {mode}
      </button>
    ))}
  </section>
);

export default QuickCreateActions;
