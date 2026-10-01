export type InstructorDomain =
  | 'general'
  | 'science'
  | 'technology'
  | 'ai'
  | 'software'
  | 'coding'
  | 'pharma'
  | 'medicine'
  | 'business'
  | 'economics'
  | 'engineering'
  | 'space'
  | 'energy'
  | 'environment'
  | 'history'
  | 'geography'
  | 'language'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'research'
  | 'news'
  | 'interview'
  | 'exam'
  | 'debate'
  | 'general_knowledge';

export type InstructorMode =
  | 'teach'
  | 'news'
  | 'research'
  | 'interview'
  | 'quiz'
  | 'debate'
  | 'explain'
  | 'compare';

export type InstructorLanguage =
  | 'auto'
  | 'english'
  | 'marathi'
  | 'hindi';

export interface InstructorRequest {
  message: string;
  topic?: string;
  domain?: InstructorDomain;
  mode?: InstructorMode;
  language?: InstructorLanguage;
  depth?: 'quick' | 'normal' | 'deep';
  questionCount?: number;
}

export interface InstructorProfile {
  id: string;
  name: string;
  domains: InstructorDomain[];
  modes: InstructorMode[];
  description: string;
  behavior: string[];
}

export interface NewsResearchRequest {
  topic: string;
  timeRange?: string;
  country?: string;
  language?: InstructorLanguage;
  depth?: 'quick' | 'normal' | 'deep';
}

export interface NewsSource {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  summary?: string;
}

export interface InstructorResponse {
  instructor: InstructorProfile;
  intent: InstructorMode;
  domain: InstructorDomain;
  topic: string;
  language: InstructorLanguage;
  responsePlan: string[];
  requiresOnlineResearch: boolean;
  requiresInterview: boolean;
  requiresMemory: boolean;
  sources: NewsSource[];
}
