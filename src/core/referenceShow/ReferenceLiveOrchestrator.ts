import {
  createLiveShowFromReference,
  validateReferenceShow,
} from '../../services/referenceShow/ReferenceToLiveEngine';

export function createReferenceLiveProduction(input: {
  sourceUrl: string;
  subject: string;
}) {
  const plan = createLiveShowFromReference(
    input.sourceUrl,
    input.subject,
  );

  const errors = validateReferenceShow(plan);

  if (errors.length) {
    return {
      status: 'blocked' as const,
      errors,
    };
  }

  return {
    status: 'ready' as const,
    plan,
    pipeline: [
      'reference analysis',
      'format extraction',
      'original script',
      'AI host',
      'AI set/background',
      'camera direction',
      'graphics',
      'voice',
      'music',
      'live scene generation',
      'real-time switching',
      'timeline',
      'broadcast-style output',
    ],
  };
}
