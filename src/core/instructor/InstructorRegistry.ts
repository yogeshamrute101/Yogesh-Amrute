import {
  InstructorDomain,
  InstructorMode,
  InstructorProfile,
} from './UniversalInstructorTypes';

const profiles: InstructorProfile[] = [
  {
    id: 'universal-teacher',
    name: 'Universal Teacher',
    domains: ['general', 'general_knowledge'],
    modes: ['teach', 'explain', 'quiz'],
    description: 'Explains arbitrary subjects clearly and progressively.',
    behavior: ['ask level', 'use examples', 'check understanding'],
  },
  {
    id: 'ai-technology-instructor',
    name: 'AI & Technology Instructor',
    domains: ['ai', 'technology', 'software', 'coding'],
    modes: ['teach', 'news', 'research', 'interview', 'quiz', 'compare'],
    description: 'Handles AI, software, agents, coding and technology.',
    behavior: ['technical accuracy', 'examples', 'tradeoffs', 'follow-ups'],
  },
  {
    id: 'science-instructor',
    name: 'Science Instructor',
    domains: ['science', 'physics', 'chemistry', 'biology'],
    modes: ['teach', 'news', 'research', 'interview', 'quiz'],
    description: 'Explains scientific concepts and research.',
    behavior: ['evidence', 'mechanisms', 'uncertainty', 'sources'],
  },
  {
    id: 'space-engineering-instructor',
    name: 'Space & Engineering Instructor',
    domains: ['space', 'engineering'],
    modes: ['teach', 'news', 'research', 'interview', 'quiz'],
    description: 'Handles spaceflight, engineering and technical systems.',
    behavior: ['technical reasoning', 'constraints', 'real-world examples'],
  },
  {
    id: 'pharma-research-instructor',
    name: 'Pharma & Research Instructor',
    domains: ['pharma', 'medicine', 'biology', 'research'],
    modes: ['teach', 'news', 'research', 'interview', 'quiz'],
    description: 'Handles pharmaceutical and biomedical research topics.',
    behavior: ['source-first', 'distinguish evidence levels', 'avoid unsupported claims'],
  },
  {
    id: 'business-instructor',
    name: 'Business & Industry Instructor',
    domains: ['business', 'economics'],
    modes: ['teach', 'news', 'research', 'interview', 'compare'],
    description: 'Explains companies, industries, economics and business developments.',
    behavior: ['context', 'data', 'sources', 'tradeoffs'],
  },
  {
    id: 'world-news-instructor',
    name: 'World News Instructor',
    domains: ['news', 'general'],
    modes: ['news', 'research', 'explain', 'compare'],
    description: 'Researches current developments and explains them with sources.',
    behavior: ['current sources', 'dates', 'cross-checking', 'uncertainty'],
  },
  {
    id: 'language-instructor',
    name: 'Language Instructor',
    domains: ['language'],
    modes: ['teach', 'interview', 'quiz', 'explain'],
    description: 'Teaches languages through conversation and correction.',
    behavior: ['conversation', 'correction', 'examples', 'practice'],
  },
  {
    id: 'exam-instructor',
    name: 'Exam Instructor',
    domains: ['exam', 'general_knowledge'],
    modes: ['teach', 'quiz', 'interview'],
    description: 'Runs adaptive exam-style questioning.',
    behavior: ['difficulty adaptation', 'scoring', 'revision'],
  },
  {
    id: 'debate-instructor',
    name: 'Debate Instructor',
    domains: ['debate', 'general'],
    modes: ['teach', 'debate', 'interview', 'research'],
    description: 'Tests reasoning by examining multiple documented perspectives.',
    behavior: ['separate facts from claims', 'ask counterarguments', 'source claims'],
  },
];

export class InstructorRegistry {
  list(): InstructorProfile[] {
    return profiles;
  }

  find(id: string): InstructorProfile | undefined {
    return profiles.find((profile) => profile.id === id);
  }

  match(domain: InstructorDomain, mode: InstructorMode): InstructorProfile {
    return (
      profiles.find(
        (profile) =>
          profile.domains.includes(domain) &&
          profile.modes.includes(mode),
      ) ??
      profiles.find((profile) => profile.id === 'universal-teacher')!
    );
  }
}
