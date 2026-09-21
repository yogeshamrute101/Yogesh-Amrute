import { searchProject } from "./project-search";

export interface ResearchResult {
  question: string;
  projectKnowledge: string;
  relevantSections: string[];
  status: "ready" | "error";
}

export async function researchProject(
  question: string
): Promise<ResearchResult> {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    throw new Error("Researcher needs a question.");
  }

  try {
    const results = await searchProject(cleanQuestion, 8);

    const relevantSections = results.map(
      (result) =>
        `===== ${result.file} =====\n${result.content}`
    );

    return {
      question: cleanQuestion,
      projectKnowledge: relevantSections.join("\n\n"),
      relevantSections,
      status: "ready",
    };
  } catch (error) {
    return {
      question: cleanQuestion,
      projectKnowledge: "",
      relevantSections: [],
      status: "error",
    };
  }
}
