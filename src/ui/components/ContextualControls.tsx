import React from "react";

export interface ContextualControlsProps {
  visible?: boolean;
  subject?: string;
  role?: string;
  voice?: string;
  appearance?: string;
  environment?: string;
  onChange?: (key: string, value: string) => void;
}

export const ContextualControls: React.FC<ContextualControlsProps> = ({
  visible = true,
  subject = "",
  role = "",
  voice = "",
  appearance = "",
  environment = "",
  onChange,
}) => {
  if (!visible) return null;

  const update = (key: string, value: string) => {
    onChange?.(key, value);
  };

  return (
    <section
      aria-label="Contextual controls"
      data-testid="contextual-controls"
      style={{
        display: "grid",
        gap: 8,
        padding: 12,
        borderRadius: 12,
      }}
    >
      <label>
        Subject
        <input
          value={subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="Subject"
        />
      </label>

      <label>
        Role
        <input
          value={role}
          onChange={(e) => update("role", e.target.value)}
          placeholder="Instructor / Host / Reporter"
        />
      </label>

      <label>
        Voice
        <input
          value={voice}
          onChange={(e) => update("voice", e.target.value)}
          placeholder="Voice"
        />
      </label>

      <label>
        Appearance
        <input
          value={appearance}
          onChange={(e) => update("appearance", e.target.value)}
          placeholder="Male / Female / Character"
        />
      </label>

      <label>
        Environment
        <input
          value={environment}
          onChange={(e) => update("environment", e.target.value)}
          placeholder="Studio / Classroom / Lab"
        />
      </label>
    </section>
  );
};

export default ContextualControls;
