export interface TopLevelValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_OPERATIONS_COUNT = 30;

/**
 * AiResponseValidator
 * Performs structural verification on the parsed AI response before semantic timeline checks.
 */
export class AiResponseValidator {
  static validate(data: unknown): TopLevelValidationResult {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'AI response data must be a valid object' };
    }

    const { intent, explanation, operations } = data as any;

    if (typeof intent !== 'string' || !intent.trim()) {
      return { isValid: false, error: 'AI response missing "intent" description' };
    }

    if (typeof explanation !== 'string' || !explanation.trim()) {
      return { isValid: false, error: 'AI response missing "explanation" summary' };
    }

    if (!Array.isArray(operations)) {
      return { isValid: false, error: 'AI response "operations" must be an array' };
    }

    if (operations.length === 0) {
      return { isValid: false, error: 'AI response contains zero actionable operations' };
    }

    if (operations.length > MAX_OPERATIONS_COUNT) {
      return {
        isValid: false,
        error: `AI response exceeded maximum safe operation limit (${operations.length} > ${MAX_OPERATIONS_COUNT})`,
      };
    }

    return { isValid: true };
  }
}
