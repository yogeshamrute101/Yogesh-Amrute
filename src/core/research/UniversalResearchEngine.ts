export type ResearchDomain =
  | "EARTH"
  | "SPACE"
  | "SOLAR_SYSTEM"
  | "ASTRONOMY"
  | "ASTROPHYSICS"
  | "PLANETARY_SCIENCE"
  | "BIOLOGY"
  | "CHEMISTRY"
  | "PHYSICS"
  | "GEOLOGY"
  | "CLIMATE"
  | "LIFE"
  | "TECHNOLOGY"
  | "UNKNOWN";

export interface ResearchQuestion {
  id: string;
  question: string;
  domain: ResearchDomain;
  priority?: number;
  createdAt: number;
}

export interface ResearchSource {
  id: string;
  title: string;
  sourceType:
    | "PAPER"
    | "DATASET"
    | "MISSION"
    | "OBSERVATION"
    | "DOCUMENT"
    | "EXPERIMENT"
    | "OTHER";
  url?: string;
  reliability?: number;
  publishedAt?: number;
}

export interface ResearchFinding {
  statement: string;
  evidence: string[];
  confidence: number;
  limitations: string[];
}

export interface ScientificStudy {
  studyId: string;
  question: ResearchQuestion;
  sources: ResearchSource[];
  findings: ResearchFinding[];
  hypotheses: string[];
  contradictions: string[];
  unknowns: string[];
  nextExperiments: string[];
  status: "EXPLORING" | "ANALYZING" | "VALIDATING" | "INCONCLUSIVE";
  createdAt: number;
}

export class UniversalResearchEngine {
  startStudy(question: ResearchQuestion): ScientificStudy {
    return {
      studyId: `study-${Date.now()}`,
      question,
      sources: [],
      findings: [],
      hypotheses: [],
      contradictions: [],
      unknowns: [
        "Relevant evidence has not yet been collected.",
      ],
      nextExperiments: [
        "Collect authoritative observations and datasets.",
        "Compare independent sources.",
        "Test competing explanations.",
      ],
      status: "EXPLORING",
      createdAt: Date.now(),
    };
  }

  addSource(
    study: ScientificStudy,
    source: ResearchSource
  ): ScientificStudy {
    return {
      ...study,
      sources: [...study.sources, source],
      status: "ANALYZING",
    };
  }

  addFinding(
    study: ScientificStudy,
    finding: ResearchFinding
  ): ScientificStudy {
    return {
      ...study,
      findings: [...study.findings, finding],
      unknowns: study.unknowns.filter(
        (item) => item !== "Relevant evidence has not yet been collected."
      ),
    };
  }

  addHypothesis(
    study: ScientificStudy,
    hypothesis: string
  ): ScientificStudy {
    return {
      ...study,
      hypotheses: [...study.hypotheses, hypothesis],
    };
  }

  validate(study: ScientificStudy): ScientificStudy {
    const hasEvidence = study.findings.length > 0;
    const hasContradictions = study.contradictions.length > 0;

    return {
      ...study,
      status:
        hasEvidence && !hasContradictions
          ? "VALIDATING"
          : "INCONCLUSIVE",
    };
  }
}
