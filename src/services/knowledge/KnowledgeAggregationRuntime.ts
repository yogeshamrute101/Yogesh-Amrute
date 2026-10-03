export interface KnowledgeSourceRecord {
  id: string;
  title: string;
  sourceUrl?: string;
  content: string;
  retrievedAt: string;
  fingerprint: string;
}

export interface AggregatedKnowledge {
  records: KnowledgeSourceRecord[];
  uniqueFingerprints: number;
  estimatedBytes: number;
}

function fingerprint(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}

export class KnowledgeAggregationRuntime {
  aggregate(
    records: KnowledgeSourceRecord[],
    maxRecords = 200,
  ): AggregatedKnowledge {
    const seen = new Set<string>();
    const output: KnowledgeSourceRecord[] = [];

    for (const record of records) {
      const fp = record.fingerprint || fingerprint(record.content);

      if (seen.has(fp)) continue;

      seen.add(fp);
      output.push({
        ...record,
        fingerprint: fp,
      });

      if (output.length >= maxRecords) break;
    }

    const estimatedBytes = output.reduce(
      (total, record) =>
        total +
        record.content.length +
        record.title.length +
        (record.sourceUrl?.length ?? 0),
      0,
    );

    return {
      records: output,
      uniqueFingerprints: seen.size,
      estimatedBytes,
    };
  }
}
