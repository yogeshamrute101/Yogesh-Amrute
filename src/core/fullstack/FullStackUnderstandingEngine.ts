import {
  FullStackIntent,
  FullStackLayer,
  FullStackOperation,
} from './FullStackTypes';

function detectLayers(prompt: string): FullStackLayer[] {
  const text = prompt.toLowerCase();
  const layers = new Set<FullStackLayer>();

  if (
    /frontend|ui|ux|screen|page|component|button|form|modal|react|tsx|css|design|layout/.test(
      text
    )
  ) {
    layers.add('frontend');
  }

  if (
    /backend|server|api|route|endpoint|controller|service|auth|middleware|websocket/.test(
      text
    )
  ) {
    layers.add('backend');
  }

  if (
    /data|database|db|schema|model|table|storage|persist|json|sql|mongodb|postgres|sqlite/.test(
      text
    )
  ) {
    layers.add('data');
  }

  if (
    /integrate|integration|connect|workflow|agent|provider|external|api key/.test(
      text
    )
  ) {
    layers.add('integration');
  }

  if (layers.size === 0) {
    layers.add('unknown');
  }

  return [...layers];
}

function detectOperations(prompt: string): FullStackOperation[] {
  const text = prompt.toLowerCase();
  const operations = new Set<FullStackOperation>();

  if (/create|build|add|make|generate|implement/.test(text)) {
    operations.add('create');
  }

  if (/update|change|modify|edit|improve|fix|repair/.test(text)) {
    operations.add('update');
  }

  if (/delete|remove/.test(text)) {
    operations.add('delete');
  }

  if (/connect|integrate|wire|link/.test(text)) {
    operations.add('connect');
  }

  if (/migrate|migration|schema change/.test(text)) {
    operations.add('migrate');
  }

  if (/test|verify|validate|check/.test(text)) {
    operations.add('test');
  }

  if (/explain|understand|analyze|inspect|audit/.test(text)) {
    operations.add('explain');
  }

  if (operations.size === 0) {
    operations.add('inspect');
  }

  return [...operations];
}

export function understandFullStackPrompt(
  prompt: string
): FullStackIntent {
  const layers = detectLayers(prompt);
  const operations = detectOperations(prompt);

  return {
    goal: prompt.trim(),
    layers,
    operations,
    entities: [],
    files: [],
    routes: [],
    dataModels: [],
    dependencies: [],
    explanation:
      `Detected ${layers.join(', ')} layer(s) and ` +
      `${operations.join(', ')} operation(s).`,
  };
}
