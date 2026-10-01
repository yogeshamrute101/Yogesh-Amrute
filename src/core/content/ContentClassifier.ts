import {
  ContentInput,
  ContentUnderstandingResult,
} from './ContentTypes';

import { understandContent } from './ContentUnderstandingEngine';

export class ContentClassifier {
  classify(
    input: ContentInput
  ): ContentUnderstandingResult {
    return understandContent(input);
  }
}

export const contentClassifier = new ContentClassifier();
