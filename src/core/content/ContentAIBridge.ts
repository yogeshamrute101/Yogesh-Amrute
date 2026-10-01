import {
  ContentInput,
  ContentUnderstandingResult,
} from './ContentTypes';

import { contentClassifier } from './ContentClassifier';

export function analyzeMediaOrText(
  input: ContentInput
): ContentUnderstandingResult {
  return contentClassifier.classify(input);
}
