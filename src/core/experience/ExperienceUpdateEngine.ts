import { ExperienceRecord } from "./ExperienceEngine";

export class ExperienceUpdateEngine {
  update(
    previous: ExperienceRecord[],
    newRecord: ExperienceRecord
  ) {
    const updated = [...previous, newRecord];

    return {
      records: updated,
      updateApplied: true,
      verifiedRecord:
        newRecord.verified &&
        newRecord.outcome !== "UNKNOWN",
    };
  }

  invalidate(
    records: ExperienceRecord[],
    recordId: string,
    reason: string
  ) {
    return records.map(record =>
      record.id === recordId
        ? {
            ...record,
            verified: false,
            metadata: {
              ...record.metadata,
              invalidationReason: reason,
            },
          }
        : record
    );
  }
}
