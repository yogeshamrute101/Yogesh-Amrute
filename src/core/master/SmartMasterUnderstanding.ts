import {
  MasterAction,
  MasterDomain,
  SmartMasterIntent,
} from './SmartMasterTypes';

function detectDomains(text: string): MasterDomain[] {
  const value = text.toLowerCase();
  const domains = new Set<MasterDomain>();

  if (
    /prompt|idea|build|create|make|develop|implement|app/.test(value)
  ) {
    domains.add('prompt');
  }

  if (
    /frontend|react|tsx|ui|ux|screen|page|component|button|form|design/.test(
      value
    )
  ) {
    domains.add('frontend');
  }

  if (
    /backend|server|api|route|endpoint|service|auth|middleware/.test(
      value
    )
  ) {
    domains.add('backend');
  }

  if (
    /data|database|db|schema|table|model|storage|persist|json|sql/.test(
      value
    )
  ) {
    domains.add('data');
  }

  if (
    /video|reel|movie|clip|frame|subtitle|caption|audio/.test(
      value
    )
  ) {
    domains.add('video');
  }

  if (
    /image|photo|picture|visual|ocr/.test(value)
  ) {
    domains.add('image');
  }

  if (
    /text|written|document|article|script|story/.test(value)
  ) {
    domains.add('text');
  }

  if (
    /classify|classification|kids|family|educational|professional|medical|pharma|gaming|entertainment/.test(
      value
    )
  ) {
    domains.add('content');
  }

  if (
    /agent|autonomous|copilot|robot|ai worker|assistant/.test(value)
  ) {
    domains.add('agent');
  }

  if (
    /workflow|automation|pipeline|orchestration|n8n/.test(value)
  ) {
    domains.add('workflow');
  }

  if (
    /integrate|integration|provider|connector|external/.test(value)
  ) {
    domains.add('integration');
  }

  if (
    /test|lint|build|verify|validation|quality/.test(value)
  ) {
    domains.add('testing');
  }

  if (
    /recover|recovery|error|rollback|repair|self heal/.test(value)
  ) {
    domains.add('recovery');
  }

  if (domains.size === 0) {
    domains.add('unknown');
  }

  return [...domains];
}

function detectActions(text: string): MasterAction[] {
  const value = text.toLowerCase();
  const actions = new Set<MasterAction>();

  if (/understand|analyze|interpret/.test(value)) {
    actions.add('understand');
  }

  if (/inspect|scan|audit|discover/.test(value)) {
    actions.add('inspect');
  }

  if (/plan|architect|design/.test(value)) {
    actions.add('plan');
  }

  if (/create|build|add|generate/.test(value)) {
    actions.add('create');
  }

  if (/update|modify|edit|improve|fix|repair/.test(value)) {
    actions.add('update');
  }

  if (/connect|integrate|wire/.test(value)) {
    actions.add('connect');
  }

  if (/classify|categorize|detect/.test(value)) {
    actions.add('classify');
  }

  if (/run|execute|perform|apply/.test(value)) {
    actions.add('execute');
  }

  if (/test|verify|validate|check/.test(value)) {
    actions.add('verify');
  }

  if (/recover|repair|rollback/.test(value)) {
    actions.add('recover');
  }

  if (/explain|describe/.test(value)) {
    actions.add('explain');
  }

  if (actions.size === 0) {
    actions.add('understand');
    actions.add('inspect');
    actions.add('plan');
  }

  return [...actions];
}

export function understandSmartMasterPrompt(
  prompt: string
): SmartMasterIntent {
  const domains = detectDomains(prompt);
  const actions = detectActions(prompt);

  return {
    originalPrompt: prompt,
    domains,
    actions,
    requiresFrontend: domains.includes('frontend'),
    requiresBackend: domains.includes('backend'),
    requiresData: domains.includes('data'),
    requiresMediaUnderstanding:
      domains.includes('video') ||
      domains.includes('image') ||
      domains.includes('text') ||
      domains.includes('content'),
    requiresAgentExecution:
      domains.includes('agent') ||
      domains.includes('workflow'),
    requiresVerification:
      actions.includes('verify') ||
      actions.includes('create') ||
      actions.includes('update') ||
      actions.includes('execute'),
    explanation:
      `Detected domains: ${domains.join(', ')}. ` +
      `Detected actions: ${actions.join(', ')}.`,
  };
}
