export interface GeneratedOutput {
  id: string;
  jobId: string;
  kind: string;
  prompt: string;
  mediaUrl: string;
  title?: string;
  durationSec?: number;
  createdAt: number;
}

const STORAGE_KEY = "vidoai.generated.outputs";

const read = (): GeneratedOutput[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items: GeneratedOutput[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const GeneratedOutputStore = {
  list(): GeneratedOutput[] {
    return read();
  },

  save(
    output: Omit<GeneratedOutput, "id" | "createdAt">
  ): GeneratedOutput {
    const existing = read().find(
      (item) => item.jobId === output.jobId
    );

    if (existing) {
      return existing;
    }

    const item: GeneratedOutput = {
      ...output,
      id: `output_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      createdAt: Date.now(),
    };

    write([item, ...read()]);
    return item;
  },

  remove(id: string) {
    write(read().filter((item) => item.id !== id));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
