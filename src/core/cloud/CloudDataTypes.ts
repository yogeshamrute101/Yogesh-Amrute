export type CloudDataType =
  | 'project'
  | 'media'
  | 'generation'
  | 'workflow'
  | 'agent'
  | 'copilot'
  | 'editor'
  | 'settings';

export interface CloudUserContext {
  userId: string;
}

export interface CloudRecord {
  id: string;
  type: CloudDataType;
  userId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CloudHealthResult {
  ok: boolean;
  projectId: string;
  bucket: string;
  firestore: boolean;
  storage: boolean;
}
