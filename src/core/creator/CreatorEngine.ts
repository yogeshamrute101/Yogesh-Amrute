export type CreationType =
  | "IDEA"
  | "DOCUMENT"
  | "DESIGN"
  | "FORMULA"
  | "SOFTWARE"
  | "PROJECT"
  | "MODEL"
  | "TEMPLATE"
  | "CONTENT";

export interface CreationRequest {
  id: string;
  type: CreationType;
  purpose: string;
  requirements: string[];
  constraints?: string[];
}

export class CreatorEngine {
  create(request: CreationRequest) {
    return {
      id: request.id,
      type: request.type,
      purpose: request.purpose,
      requirements: request.requirements,
      status: "PLANNED",
      requiresVerification: true,
    };
  }
}
