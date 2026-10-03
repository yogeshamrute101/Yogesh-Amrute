import type {
  KnowledgeSource,
} from '../../types/knowledge/UniversalKnowledge';

const sourceIndex = new Map<string, KnowledgeSource>();

export function rememberSource(source: KnowledgeSource) {
  sourceIndex.set(source.id, source);
}

export function getSource(id: string) {
  return sourceIndex.get(id);
}

export function listSources() {
  return [...sourceIndex.values()];
}
