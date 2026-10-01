import { agentRegistry } from "./AgentRegistry";

export type CapabilityMatch = {
  capability: string;
  confidence: number;
};

const RULES: Array<{
  capability: string;
  patterns: RegExp[];
}> = [
  {
    capability: "research",
    patterns: [
      /\bresearch\b/i,
      /\bstudy\b/i,
      /\banaly[sz]e\b/i,
      /\binvestigate\b/i,
      /\bfind information\b/i,
    ],
  },
  {
    capability: "document-analysis",
    patterns: [
      /\bpdf\b/i,
      /\bdocument\b/i,
      /\breport\b/i,
      /\bfile\b/i,
    ],
  },
  {
    capability: "video-generation",
    patterns: [
      /\bvideo\b/i,
      /\breel\b/i,
      /\bshort\b/i,
      /\bexplainer\b/i,
      /\bmovie\b/i,
    ],
  },
  {
    capability: "voice",
    patterns: [
      /\bvoice\b/i,
      /\bspeech\b/i,
      /\bspeak\b/i,
      /\btalking\b/i,
      /\bavatar\b/i,
      /\brobot\b/i,
    ],
  },
  {
    capability: "editor-control",
    patterns: [
      /\btrim\b/i,
      /\bcut\b/i,
      /\bedit\b/i,
      /\bcaption/i,
      /\bsubtitle/i,
      /\btimeline\b/i,
      /\bmusic\b/i,
      /\beffect/i,
      /\bexport\b/i,
    ],
  },
];

export function routeCapabilities(prompt: string): CapabilityMatch[] {
  const matches: CapabilityMatch[] = [];

  for (const rule of RULES) {
    const hits = rule.patterns.filter((pattern) =>
      pattern.test(prompt),
    ).length;

    if (hits > 0 && agentRegistry.findByCapability(rule.capability).length) {
      matches.push({
        capability: rule.capability,
        confidence: Math.min(1, hits / 2),
      });
    }
  }

  if (matches.length === 0) {
    matches.push({
      capability: "orchestration",
      confidence: 0.5,
    });
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}
