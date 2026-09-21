import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type KnowledgeStatus =
  | "DISCOVERED"
  | "COLLECTED"
  | "COMPARED"
  | "VALIDATED"
  | "UNCERTAIN"
  | "NEEDS_REVIEW";

export interface StudyTopic {
  id: string;
  subject: string;
  subtopics: string[];
  priority?: number;
}

export interface KnowledgeRecord {
  id: string;
  subject: string;
  topic: string;
  summary: string;
  evidence: string[];
  status: KnowledgeStatus;
  confidence: number;
  assumptions: string[];
  openQuestions: string[];
  updatedAt: string;
}

export class AutonomousStudyEngine {
  private root = "docs/generated/research";
  private queuePath = join(this.root, "study-queue.json");
  private knowledgePath = join(this.root, "knowledge-base.json");

  constructor() {
    mkdirSync(this.root, { recursive: true });

    if (!existsSync(this.queuePath)) {
      writeFileSync(this.queuePath, "[]", "utf8");
    }

    if (!existsSync(this.knowledgePath)) {
      writeFileSync(this.knowledgePath, "[]", "utf8");
    }
  }

  addTopics(topics: StudyTopic[]): void {
    const queue = JSON.parse(readFileSync(this.queuePath, "utf8"));
    const existing = new Set(queue.map((item: StudyTopic) => item.id));

    for (const topic of topics) {
      if (!existing.has(topic.id)) {
        queue.push(topic);
      }
    }

    queue.sort(
      (a: StudyTopic, b: StudyTopic) =>
        (b.priority ?? 0) - (a.priority ?? 0)
    );

    writeFileSync(this.queuePath, JSON.stringify(queue, null, 2), "utf8");
  }

  createResearchRecord(input: {
    subject: string;
    topic: string;
    summary: string;
    evidence?: string[];
    status?: KnowledgeStatus;
    confidence?: number;
    assumptions?: string[];
    openQuestions?: string[];
  }): KnowledgeRecord {
    const record: KnowledgeRecord = {
      id: `${Date.now()}-${input.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`,
      subject: input.subject,
      topic: input.topic,
      summary: input.summary,
      evidence: input.evidence ?? [],
      status: input.status ?? "DISCOVERED",
      confidence: Math.max(0, Math.min(1, input.confidence ?? 0)),
      assumptions: input.assumptions ?? [],
      openQuestions: input.openQuestions ?? [],
      updatedAt: new Date().toISOString(),
    };

    const knowledge = JSON.parse(
      readFileSync(this.knowledgePath, "utf8")
    );

    knowledge.push(record);

    writeFileSync(
      this.knowledgePath,
      JSON.stringify(knowledge, null, 2),
      "utf8"
    );

    return record;
  }

  studyLoop(): {
    stages: string[];
    knowledgeFile: string;
    queueFile: string;
  } {
    return {
      stages: [
        "DISCOVER SUBJECT",
        "BREAK INTO SUBTOPICS",
        "COLLECT AUTHORIZED SOURCES",
        "COMPARE SOURCES",
        "IDENTIFY EVIDENCE",
        "SEPARATE FACTS FROM HYPOTHESES",
        "CHECK UNCERTAINTY",
        "STORE KNOWLEDGE",
        "GENERATE OPEN QUESTIONS",
        "REVISIT AND UPDATE",
      ],
      knowledgeFile: this.knowledgePath,
      queueFile: this.queuePath,
    };
  }
}
