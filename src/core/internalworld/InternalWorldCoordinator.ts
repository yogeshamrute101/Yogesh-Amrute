import { InternalWorldRegistry } from "../worlds/InternalWorldRegistry";
import { InternalRoleRegistry } from "../internalroles/InternalRoleRegistry";

export class InternalWorldCoordinator {
  constructor(
    private readonly worlds = new InternalWorldRegistry(),
    private readonly roles = new InternalRoleRegistry()
  ) {}

  registerWorld(world: Parameters<InternalWorldRegistry["register"]>[0]) {
    return this.worlds.register(world);
  }

  registerRole(role: Parameters<InternalRoleRegistry["register"]>[0]) {
    return this.roles.register(role);
  }

  snapshot() {
    return {
      worlds: this.worlds.all(),
      roles: this.roles.all(),
      extensible: true,
      fixedWorldLimit: false,
    };
  }
}
