export interface PresentationSlide {
  number: number;
  title?: string;
  content: string[];
  notes?: string[];
}

export interface PresentationTemplate {
  name: string;
  purpose: string;
  slideStructure: string[];
}

export class PresentationEngine {
  analyze(slides: PresentationSlide[]) {
    return {
      slideCount: slides.length,
      titles: slides.map(x => x.title).filter(Boolean),
      contentDensity: slides.map(x => x.content.length),
    };
  }

  createTemplate(template: PresentationTemplate) {
    return { ...template, verified: false };
  }
}
