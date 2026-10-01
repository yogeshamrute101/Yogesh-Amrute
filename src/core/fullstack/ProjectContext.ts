export interface ProjectFile {
  path: string;
  layer:
    | 'frontend'
    | 'backend'
    | 'data'
    | 'integration'
    | 'unknown';
  extension: string;
}

export interface ProjectContext {
  root: string;
  files: ProjectFile[];
  frontendFiles: string[];
  backendFiles: string[];
  dataFiles: string[];
  integrationFiles: string[];
}

export function classifyFile(path: string): ProjectFile {
  const extension = path.includes('.')
    ? path.slice(path.lastIndexOf('.') + 1)
    : '';

  const lower = path.toLowerCase();

  let layer: ProjectFile['layer'] = 'unknown';

  if (
    /src\/.*\.(tsx|jsx|css|scss)$/.test(lower) ||
    /components|screens|pages|ui/.test(lower)
  ) {
    layer = 'frontend';
  } else if (
    /server|api|routes|controller|middleware|backend/.test(lower)
  ) {
    layer = 'backend';
  } else if (
    /database|db|store|storage|repository|schema|migration|persistence|\.json$/.test(
      lower
    )
  ) {
    layer = 'data';
  } else if (
    /integration|provider|adapter|connector|workflow|agent/.test(lower)
  ) {
    layer = 'integration';
  }

  return { path, layer, extension };
}
