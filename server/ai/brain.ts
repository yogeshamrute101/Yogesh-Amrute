import { researchProject } from "./researcher";

export interface BrainRequest {
  question: string;
}

export interface BrainResult {
  question: string;
  understanding: string;
  nextStep: string;
  status: "ready" | "error";
  research?: {
    relevantSections: string[];
  };
}

export async function runBrain(
  request: BrainRequest
): Promise<BrainResult> {
  const question = request.question.trim();

  if (!question) {
    throw new Error("Brain needs a question.");
  }

  try {
    const research = await researchProject(question);

    return {
      question,
      understanding: `The Brain researched the project for: ${question}`,
      nextStep:
        research.status === "ready"
          ? "Use the project evidence to plan the next action."
          : "Research could not be completed.",
      status: research.status === "ready" ? "ready" : "error",
      research: {
        relevantSections: research.relevantSections,
      },
    };
  } catch (error) {
    return {
      question,
      understanding: "The Brain could not complete the research.",
      nextStep: "Check the project aggregation and researcher.",
      status: "error",
    };
  }
}
