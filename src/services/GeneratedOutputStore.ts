export type GeneratedOutput = {
  id: string;
  jobId: string;
  url: string;
  type: "video";
  format: "mp4";
  source: string;
  createdAt: number;
};

const STORAGE_KEY = "vidoai.project.generatedOutputs";

export function getGeneratedOutputs(): GeneratedOutput[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGeneratedOutput(
  output: GeneratedOutput
): GeneratedOutput[] {
  const outputs = getGeneratedOutputs();

  const next = [
    ...outputs.filter((item) => item.id !== output.id),
    output,
  ].slice(-50);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage is optional.
  }

  return next;
}

export function removeGeneratedOutput(id: string): void {
  const next = getGeneratedOutputs().filter(
    (item) => item.id !== id
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage is optional.
  }
}
