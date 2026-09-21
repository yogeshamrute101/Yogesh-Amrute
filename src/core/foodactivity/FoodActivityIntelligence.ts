export type SubjectType =
  | "HUMAN"
  | "ANIMAL"
  | "SYSTEM"
  | "ROBOT";

export type FoodOperation =
  | "PLAN_MEAL"
  | "CREATE_RECIPE"
  | "ANALYZE_NUTRITION"
  | "CHECK_INGREDIENTS"
  | "ADAPT_RECIPE"
  | "COOK_GUIDANCE"
  | "FOOD_SAFETY"
  | "STORAGE_GUIDANCE";

export type ActivityOperation =
  | "OBSERVE"
  | "CLASSIFY"
  | "PLAN"
  | "GUIDE"
  | "TRACK"
  | "ADAPT"
  | "REST"
  | "ENRICHMENT";

export interface FoodRequest {
  id: string;
  subject: SubjectType;
  operation: FoodOperation;
  ingredients: string[];
  restrictions: string[];
  preferences: string[];
  servings: number;
}

export interface ActivityRequest {
  id: string;
  subject: SubjectType;
  operation: ActivityOperation;
  goal: string;
  environment: string;
  durationMinutes?: number;
  limitations: string[];
}

export interface FoodResult {
  requestId: string;
  ingredients: string[];
  steps: string[];
  nutritionNotes: string[];
  safetyNotes: string[];
  requiresHumanReview: boolean;
}

export interface ActivityResult {
  requestId: string;
  suggestedActivities: string[];
  observations: string[];
  safetyNotes: string[];
  requiresHumanReview: boolean;
}

export class FoodActivityIntelligence {
  private foodRequests = new Map<string, FoodRequest>();
  private activityRequests = new Map<string, ActivityRequest>();

  createFoodRequest(
    subject: SubjectType,
    operation: FoodOperation,
    ingredients: string[] = [],
    servings = 1
  ) {
    const request: FoodRequest = {
      id: `food-${Date.now()}`,
      subject,
      operation,
      ingredients,
      restrictions: [],
      preferences: [],
      servings,
    };

    this.foodRequests.set(request.id, request);
    return request;
  }

  createActivityRequest(
    subject: SubjectType,
    operation: ActivityOperation,
    goal: string,
    environment: string
  ) {
    const request: ActivityRequest = {
      id: `activity-${Date.now()}`,
      subject,
      operation,
      goal,
      environment,
      limitations: [],
    };

    this.activityRequests.set(request.id, request);
    return request;
  }

  getFoodRequests() {
    return [...this.foodRequests.values()];
  }

  getActivityRequests() {
    return [...this.activityRequests.values()];
  }
}
