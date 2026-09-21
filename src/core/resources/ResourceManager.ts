export type ResourceType =
  | "cpu" | "memory" | "storage" | "network"
  | "api" | "device" | "application" | "user-data";

export type ResourceRequest = {
  resource: ResourceType;
  amount?: number;
  purpose: string;
};

export class ResourceManager {
  private requests: ResourceRequest[] = [];

  request(input: ResourceRequest) {
    this.requests.push(input);
    return {
      accepted: true,
      resource: input.resource,
      purpose: input.purpose
    };
  }

  list() {
    return [...this.requests];
  }
}
