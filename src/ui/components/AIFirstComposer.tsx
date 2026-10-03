import React from "react";

export interface AIFirstComposerProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export const AIFirstComposer: React.FC<AIFirstComposerProps> = ({
  value = "",
  onChange,
  onSubmit,
}) => {
  return (
    <form
      aria-label="AI First Composer"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <input
        value={value}
        placeholder="What do you want to create?"
        onChange={(event) => onChange?.(event.target.value)}
      />
      <button type="submit">
        Create
      </button>
    </form>
  );
};

export default AIFirstComposer;
