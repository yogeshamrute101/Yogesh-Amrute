import {
  InstructorLanguage,
  NewsResearchRequest,
} from './UniversalInstructorTypes';

export interface ResearchBridgeResult {
  topic: string;
  query: string;
  instructions: string[];
  sourceRequirements: string[];
  language: InstructorLanguage;
}

export class InstructorResearchBridge {
  createRequest(request: NewsResearchRequest): ResearchBridgeResult {
    const language = request.language ?? 'auto';

    return {
      topic: request.topic,
      query: `${request.topic} latest news recent developments`,
      instructions: [
        'Search current online sources.',
        'Prefer primary sources and reputable reporting.',
        'Record publication date for every current claim.',
        'Cross-check important claims when practical.',
        'Separate verified facts from analysis or claims.',
        'Do not invent unavailable sources.',
        'If sources disagree, explicitly identify the disagreement.',
      ],
      sourceRequirements: [
        'headline',
        'publisher',
        'publication date',
        'source URL',
        'claim summary',
      ],
      language,
    };
  }
}
