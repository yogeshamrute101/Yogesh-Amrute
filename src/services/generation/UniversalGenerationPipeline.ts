export interface GenerationPipelineInput {
  prompt: string;
  projectId?: string;
  language?: string;
  durationSeconds?: number;
}

export type GenerationStage =
  | "prompt"
  | "script"
  | "assets"
  | "voice"
  | "captions"
  | "timeline"
  | "effects"
  | "export"
  | "project-save";

export interface GenerationStageResult {
  stage: GenerationStage;
  completed: boolean;
  output?: unknown;
  error?: string;
}

export interface GenerationPipelineResult {
  success: boolean;
  stages: GenerationStageResult[];
  projectId?: string;
}

export type StageExecutor = (
  input: unknown,
) => Promise<unknown>;

export class UniversalGenerationPipeline {
  constructor(
    private readonly executors: Partial<
      Record<GenerationStage, StageExecutor>
    >,
  ) {}

  async run(
    input: GenerationPipelineInput,
  ): Promise<GenerationPipelineResult> {
    if (!input.prompt.trim()) {
      throw new Error("Generation prompt is required.");
    }

    const stages: GenerationStage[] = [
      "prompt",
      "script",
      "assets",
      "voice",
      "captions",
      "timeline",
      "effects",
      "export",
      "project-save",
    ];

    const results: GenerationStageResult[] = [];

    let current: unknown = input;

    for (const stage of stages) {
      const executor = this.executors[stage];

      if (!executor) {
        results.push({
          stage,
          completed: false,
          error: `Stage executor not connected: ${stage}`,
        });

        return {
          success: false,
          stages: results,
          projectId: input.projectId,
        };
      }

      try {
        current = await executor(current);

        results.push({
          stage,
          completed: true,
          output: current,
        });
      } catch (error) {
        results.push({
          stage,
          completed: false,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        });

        return {
          success: false,
          stages: results,
          projectId: input.projectId,
        };
      }
    }

    return {
      success: true,
      stages: results,
      projectId: input.projectId,
    };
  }
}
