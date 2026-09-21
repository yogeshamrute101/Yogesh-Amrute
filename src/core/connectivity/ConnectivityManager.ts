export type ConnectionType =
  | "NETWORK"
  | "SERVER"
  | "DATABASE"
  | "API"
  | "DEVICE"
  | "ROBOT"
  | "SUPERCOMPUTER"
  | "CLOUD"
  | "LOCAL_SYSTEM";

export type ConnectionStatus =
  | "DISCOVERED"
  | "AVAILABLE"
  | "CONNECTED"
  | "DEGRADED"
  | "DISCONNECTED"
  | "BLOCKED"
  | "UNKNOWN";

export interface SystemEndpoint {
  id: string;
  name: string;
  type: ConnectionType;
  address?: string;
  capabilities: string[];
  authenticated: boolean;
  authorized: boolean;
  status: ConnectionStatus;
  metadata?: Record<string, unknown>;
}

export interface ConnectionRequest {
  endpointId: string;
  capability: string;
  purpose: string;
  requireEncryption?: boolean;
}

export interface ConnectionResult {
  endpointId: string;
  status: ConnectionStatus;
  capability: string;
  message: string;
  timestamp: number;
}

export class ConnectivityManager {
  private endpoints = new Map<string, SystemEndpoint>();
  private history: ConnectionResult[] = [];

  registerEndpoint(endpoint: SystemEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  discoverEndpoint(endpoint: SystemEndpoint): void {
    if (!this.endpoints.has(endpoint.id)) {
      this.endpoints.set(endpoint.id, {
        ...endpoint,
        status: "DISCOVERED",
      });
    }
  }

  inspectEndpoint(endpointId: string): SystemEndpoint | undefined {
    return this.endpoints.get(endpointId);
  }

  canConnect(
    request: ConnectionRequest,
  ): { allowed: boolean; reason: string } {
    const endpoint = this.endpoints.get(request.endpointId);

    if (!endpoint) {
      return {
        allowed: false,
        reason: "Endpoint is not registered.",
      };
    }

    if (!endpoint.authorized) {
      return {
        allowed: false,
        reason: "Endpoint is not authorized.",
      };
    }

    if (!endpoint.authenticated) {
      return {
        allowed: false,
        reason: "Authentication is required.",
      };
    }

    if (!endpoint.capabilities.includes(request.capability)) {
      return {
        allowed: false,
        reason:
          `Capability '${request.capability}' is not available.`,
      };
    }

    return {
      allowed: true,
      reason: "Connection requirements satisfied.",
    };
  }

  connect(
    request: ConnectionRequest,
  ): ConnectionResult {
    const check = this.canConnect(request);

    if (!check.allowed) {
      return this.record({
        endpointId: request.endpointId,
        status: "BLOCKED",
        capability: request.capability,
        message: check.reason,
        timestamp: Date.now(),
      });
    }

    const endpoint = this.endpoints.get(request.endpointId)!;

    endpoint.status = "CONNECTED";

    return this.record({
      endpointId: request.endpointId,
      status: "CONNECTED",
      capability: request.capability,
      message:
        `Authorized connection established with ${endpoint.name}.`,
      timestamp: Date.now(),
    });
  }

  disconnect(endpointId: string): ConnectionResult {
    const endpoint = this.endpoints.get(endpointId);

    if (!endpoint) {
      return this.record({
        endpointId,
        status: "UNKNOWN",
        capability: "disconnect",
        message: "Endpoint not found.",
        timestamp: Date.now(),
      });
    }

    endpoint.status = "DISCONNECTED";

    return this.record({
      endpointId,
      status: "DISCONNECTED",
      capability: "disconnect",
      message: `${endpoint.name} disconnected.`,
      timestamp: Date.now(),
    });
  }

  healthCheck(endpointId: string): ConnectionStatus {
    const endpoint = this.endpoints.get(endpointId);

    if (!endpoint) return "UNKNOWN";

    return endpoint.status;
  }

  listEndpoints(): SystemEndpoint[] {
    return [...this.endpoints.values()];
  }

  listConnected(): SystemEndpoint[] {
    return [...this.endpoints.values()].filter(
      (endpoint) => endpoint.status === "CONNECTED",
    );
  }

  private record(result: ConnectionResult): ConnectionResult {
    this.history.push(result);
    this.history = this.history.slice(-500);
    return result;
  }

  getHistory(): ConnectionResult[] {
    return [...this.history];
  }
}

export const connectivityManager =
  new ConnectivityManager();
