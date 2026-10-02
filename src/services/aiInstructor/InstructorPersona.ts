export type InstructorGender = 'male' | 'female' | 'neutral' | 'auto';

export type InstructorAvatarMode =
  | 'realistic'
  | '3d'
  | 'animated'
  | 'professional'
  | 'custom';

export type InstructorRole =
  | 'teacher'
  | 'mba-professor'
  | 'dance-instructor'
  | 'singing-coach'
  | 'music-teacher'
  | 'language-teacher'
  | 'math-tutor'
  | 'science-teacher'
  | 'coding-mentor'
  | 'business-mentor'
  | 'research-mentor'
  | 'fitness-instructor'
  | 'creative-coach'
  | 'custom';

export type InstructorStyle =
  | 'friendly'
  | 'professional'
  | 'academic'
  | 'strict'
  | 'motivational'
  | 'socratic'
  | 'step-by-step'
  | 'simple'
  | 'advanced';

export type InstructorPresentation =
  | 'text'
  | 'voice'
  | 'avatar'
  | 'video'
  | 'interactive';

export interface InstructorPersona {
  role: InstructorRole;
  gender: InstructorGender;
  avatarMode: InstructorAvatarMode;
  displayName: string;
  style: InstructorStyle;
  language: string;
  presentation: InstructorPresentation;
  subject?: string;
  level?: string;
  instructions?: string;
}

export interface InstructorPersonaChange {
  gender?: InstructorGender;
  avatarMode?: InstructorAvatarMode;
  role?: InstructorRole;
  displayName?: string;
  style?: InstructorStyle;
  language?: string;
  presentation?: InstructorPresentation;
  subject?: string;
  level?: string;
  instructions?: string;
}

const DEFAULT_PERSONA: InstructorPersona = {
  role: 'teacher',
  gender: 'auto',
  avatarMode: 'professional',
  displayName: 'AI Instructor',
  style: 'step-by-step',
  language: 'English',
  presentation: 'interactive',
};

export class InstructorPersonaEngine {
  private persona: InstructorPersona = { ...DEFAULT_PERSONA };

  getPersona(): InstructorPersona {
    return { ...this.persona };
  }

  change(change: InstructorPersonaChange): InstructorPersona {
    this.persona = {
      ...this.persona,
      ...change,
    };

    return this.getPersona();
  }

  switchGender(gender: InstructorGender): InstructorPersona {
    return this.change({ gender });
  }

  switchAvatarMode(
    avatarMode: InstructorAvatarMode,
  ): InstructorPersona {
    return this.change({ avatarMode });
  }

  switchRole(role: InstructorRole): InstructorPersona {
    return this.change({
      role,
      displayName: this.defaultNameForRole(role),
    });
  }

  switchPresentation(
    presentation: InstructorPresentation,
  ): InstructorPersona {
    return this.change({ presentation });
  }

  switchLanguage(language: string): InstructorPersona {
    const normalized = language.trim();

    if (!normalized) {
      throw new Error('Instructor language cannot be empty.');
    }

    return this.change({ language: normalized });
  }

  reset(): InstructorPersona {
    this.persona = { ...DEFAULT_PERSONA };
    return this.getPersona();
  }

  private defaultNameForRole(role: InstructorRole): string {
    const names: Record<InstructorRole, string> = {
      teacher: 'AI Teacher',
      'mba-professor': 'AI MBA Professor',
      'dance-instructor': 'AI Dance Instructor',
      'singing-coach': 'AI Singing Coach',
      'music-teacher': 'AI Music Teacher',
      'language-teacher': 'AI Language Teacher',
      'math-tutor': 'AI Mathematics Tutor',
      'science-teacher': 'AI Science Teacher',
      'coding-mentor': 'AI Coding Mentor',
      'business-mentor': 'AI Business Mentor',
      'research-mentor': 'AI Research Mentor',
      'fitness-instructor': 'AI Fitness Instructor',
      'creative-coach': 'AI Creative Coach',
      custom: 'AI Instructor',
    };

    return names[role];
  }
}

export const instructorPersona = new InstructorPersonaEngine();
