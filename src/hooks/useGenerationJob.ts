import { useCallback, useEffect, useRef, useState } from "react";
import { GeneratedOutputStore } from "../services/generation/GeneratedOutputStore";
import {
  createGenerationJob,
  GenerationJob,
  GenerationKind,
  getGenerationJob,
} from "../services/generation/generationApi";

export function useGenerationJob() {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const poll = useCallback(
    async (id: string) => {
      try {
        const next = await getGenerationJob(id);
        setJob(next);

        if (next.status === "completed") {
          if (next.mediaUrl) {
            GeneratedOutputStore.save({
              jobId: next.id,
              kind: next.kind,
              prompt: next.prompt,
              mediaUrl: next.mediaUrl,
              title: next.title,
              durationSec: next.durationSec,
            });
          }

          setIsGenerating(false);
          clearTimer();
          return;
        }

        if (next.status === "failed") {
          setError(next.error || "Generation failed.");
          setIsGenerating(false);
          clearTimer();
          return;
        }

        if (Date.now() - startedRef.current >= 10 * 60 * 1000) {
          setError("Generation timed out.");
          setIsGenerating(false);
          clearTimer();
          return;
        }

        timerRef.current = setTimeout(() => {
          void poll(id);
        }, 1500);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation status failed.");
        setIsGenerating(false);
        clearTimer();
      }
    },
    [clearTimer]
  );

  const generate = useCallback(
    async (kind: GenerationKind, prompt: string) => {
      clearTimer();
      setError(null);
      setIsGenerating(true);

      try {
        const created = await createGenerationJob(kind, prompt);
        setJob(created);
        startedRef.current = Date.now();
        void poll(created.id);
        return created;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Generation request failed.";
        setError(message);
        setIsGenerating(false);
        throw e;
      }
    },
    [clearTimer, poll]
  );

  const reset = useCallback(() => {
    clearTimer();
    setJob(null);
    setError(null);
    setIsGenerating(false);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  return {
    job,
    error,
    isGenerating,
    generate,
    reset,
  };
}
