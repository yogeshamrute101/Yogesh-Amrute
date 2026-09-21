export interface ControlledDocument {
  id: string;
  title: string;
  version: string;
  owner: string;
  approver?: string;
  status: "DRAFT" | "REVIEW" | "APPROVED" | "EFFECTIVE" | "SUPERSEDED";
  effectiveDate?: string;
  expiryDate?: string;
  changeReason?: string;
  previousVersionId?: string;
}

export class DocumentControl {
  private documents = new Map<string, ControlledDocument>();

  register(document: ControlledDocument) {
    this.documents.set(document.id, { ...document });
    return document;
  }

  approve(id: string, approver: string) {
    const doc = this.documents.get(id);
    if (!doc) throw new Error(`Document not found: ${id}`);
    doc.approver = approver;
    doc.status = "APPROVED";
    return doc;
  }

  makeEffective(id: string) {
    const doc = this.documents.get(id);
    if (!doc) throw new Error(`Document not found: ${id}`);
    if (doc.status !== "APPROVED") {
      throw new Error("Only approved documents can become effective");
    }
    doc.status = "EFFECTIVE";
    doc.effectiveDate ??= new Date().toISOString();
    return doc;
  }

  list() {
    return [...this.documents.values()];
  }
}
