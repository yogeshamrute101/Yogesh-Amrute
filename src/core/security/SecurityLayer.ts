export type SecurityCheck = {
  operation: string;
  authenticated: boolean;
  authorized: boolean;
  risks: string[];
};

export class SecurityLayer {
  check(input: SecurityCheck) {
    return {
      ...input,
      allowed: input.authenticated && input.authorized && input.risks.length === 0
    };
  }
}
