export type GapKind =
  | "EMPTY_SPACE"
  | "EMPTY_WORKSPACE"
  | "UNUSED_CAPABILITY"
  | "INCOMPLETE_WORK"
  | "DUPLICATE_RESOURCE"
  | "UNUSED_RESOURCE"
  | "MISSING_INTEGRATION"
  | "UNKNOWN";

export interface Gap {
  id: string;
  kind: GapKind;
  target: string;
  description: string;
  suggestedUse: string;
  confidence: number;
  requiresApproval: boolean;
}

export interface GapScanResult {
  scannedAt: string;
  gaps: Gap[];
  recommendations: string[];
}

export class GapUtilizationEngine {
  scan(input: {
    files?: string[];
    workspaces?: string[];
    capabilities?: string[];
    tasks?: string[];
    resources?: string[];
  }): GapScanResult {
    const gaps: Gap[] = [];
    const add = (
      kind: GapKind,
      target: string,
      description: string,
      suggestedUse: string,
      confidence = 0.8,
      requiresApproval = false
    ) => {
      gaps.push({
        id: `${kind}:${target}`,
        kind,
        target,
        description,
        suggestedUse,
        confidence,
        requiresApproval,
      });
    };

    for (const workspace of input.workspaces ?? []) {
      if (!workspace.trim()) {
        add(
          "EMPTY_WORKSPACE",
          "workspace",
          "Empty workspace detected.",
          "Evaluate it for an existing incomplete or planned project."
        );
      }
    }

    for (const capability of input.capabilities ?? []) {
      if (!capability.trim()) {
        add(
          "UNUSED_CAPABILITY",
          "capability",
          "Capability appears unused.",
          "Find compatible tasks before allocating it."
        );
      }
    }

    for (const task of input.tasks ?? []) {
      if (!task.trim()) {
        add(
          "INCOMPLETE_WORK",
          "task",
          "Incomplete work item detected.",
          "Match it with available capabilities and continue safely."
        );
      }
    }

    for (const resource of input.resources ?? []) {
      if (!resource.trim()) {
        add(
          "UNUSED_RESOURCE",
          "resource",
          "Unused resource detected.",
          "Measure usefulness and allocate only when beneficial."
        );
      }
    }

    const recommendations = gaps.map(
      (gap) =>
        `${gap.kind}: ${gap.target} → ${gap.suggestedUse}`
    );

    return {
      scannedAt: new Date().toISOString(),
      gaps,
      recommendations,
    };
  }
}
