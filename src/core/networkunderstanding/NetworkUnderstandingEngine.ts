export type NetworkEntity =
  | "DEVICE"
  | "SERVER"
  | "ROUTER"
  | "SWITCH"
  | "SERVICE"
  | "API"
  | "CONNECTION"
  | "NETWORK";

export interface NetworkNode {
  id: string;
  type: NetworkEntity;
  address?: string;
  protocol?: string;
  connectedTo?: string[];
  authorized?: boolean;
}

export class NetworkUnderstandingEngine {
  inspect(node: NetworkNode) {
    return {
      ...node,
      connectionCount: node.connectedTo?.length ?? 0,
      controlAllowed: node.authorized === true,
      requiresAuthentication: true,
    };
  }
}
