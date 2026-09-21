export type PrivacyAction = "collect" | "use" | "store" | "share" | "delete";

export class PrivacyLayer {
  private decisions = new Map<string, boolean>();

  allow(action: PrivacyAction, purpose: string, allowed: boolean) {
    const key = `${action}:${purpose}`;
    this.decisions.set(key, allowed);
    return allowed;
  }

  can(action: PrivacyAction, purpose: string) {
    return this.decisions.get(`${action}:${purpose}`) ?? false;
  }
}
