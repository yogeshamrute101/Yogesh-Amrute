interface Experience {
  goal: string;
  successful: boolean;
  method: string;
  timestamp: number;
}

const memory: Experience[] = [];

export function recordExperience(
  goal: string,
  successful: boolean,
  method: string
) {
  memory.push({
    goal,
    successful,
    method,
    timestamp: Date.now(),
  });

  if (memory.length > 1000) memory.shift();
}

export function findRelevantExperience(goal: string) {
  const words = goal.toLowerCase().split(/\s+/);

  return memory
    .filter((item) =>
      words.some((word) =>
        item.goal.toLowerCase().includes(word)
      )
    )
    .slice(-10);
}
