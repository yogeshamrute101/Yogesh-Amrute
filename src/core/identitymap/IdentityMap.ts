export type IdentityLink = {
  id: string;
  aliases: string[];
  canonicalId: string;
  confidence: number;
};

export class IdentityMap {
  private links = new Map<string, IdentityLink>();

  link(input: IdentityLink) {
    this.links.set(input.id, input);
    return input;
  }

  resolve(idOrAlias: string) {
    for (const link of this.links.values()) {
      if (
        link.id === idOrAlias ||
        link.canonicalId === idOrAlias ||
        link.aliases.includes(idOrAlias)
      ) {
        return link;
      }
    }

    return undefined;
  }

  all() {
    return [...this.links.values()];
  }
}
