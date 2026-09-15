import { ProjectTimeline, SavedProject, TimelineClip } from '../types';
import { INITIAL_SAMPLE_CLIPS } from '../data/sampleClips';

const STORAGE_KEY = 'vidoai_saved_projects_v2';
const CURRENT_PROJECT_KEY = 'vidoai_active_project_id';

export const DEFAULT_INITIAL_PROJECT: ProjectTimeline = {
  id: 'proj_default_vidoai',
  name: 'VIDOAI Master Reel',
  aspectRatio: '9:16',
  clips: INITIAL_SAMPLE_CLIPS,
  captions: [
    {
      id: 'cap_1',
      text: 'STOP SCROLLING! ⚠️',
      startMs: 0,
      endMs: 3800,
      style: 'yellow_viral',
      position: 'bottom',
      highlightWord: 'STOP',
    },
    {
      id: 'cap_2',
      text: 'AI Video Editing on Mobile 📲',
      startMs: 4000,
      endMs: 7800,
      style: 'yellow_viral',
      position: 'bottom',
      highlightWord: 'MOBILE',
    },
    {
      id: 'cap_3',
      text: 'Real-time Cuts & Viral Export ✨',
      startMs: 8000,
      endMs: 11500,
      style: 'neon_cyber',
      position: 'bottom',
      highlightWord: 'REAL-TIME',
    },
  ],
  stickers: [
    {
      id: 'stk_1',
      type: 'badge',
      content: '🔥 100% VIRAL',
      x: 50,
      y: 18,
      scale: 1,
      rotation: 0,
      startMs: 400,
      endMs: 4500,
      animation: 'pop',
    },
  ],
  bgAudio: {
    id: 'audio_phonk_1',
    title: 'Neon Drift (Phonk)',
    genre: 'phonk',
    volume: 0.6,
    isMuted: false,
    ducking: true,
    durationMs: 30000,
  },
  updatedAt: Date.now(),
};

export const projectStorage = {
  getProjects(): SavedProject[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Seed default initial project
        const defaultSaved: SavedProject = {
          id: DEFAULT_INITIAL_PROJECT.id,
          name: DEFAULT_INITIAL_PROJECT.name,
          timeline: DEFAULT_INITIAL_PROJECT,
          thumbnailUrl: DEFAULT_INITIAL_PROJECT.clips[0]?.thumbnail,
          durationMs: 11500,
          updatedAt: Date.now() - 3600000,
        };
        const sample2: SavedProject = {
          id: 'proj_sample_cyber',
          name: 'Cyberpunk Neon Shorts',
          timeline: {
            ...DEFAULT_INITIAL_PROJECT,
            id: 'proj_sample_cyber',
            name: 'Cyberpunk Neon Shorts',
            aspectRatio: '9:16',
            clips: [INITIAL_SAMPLE_CLIPS[1], INITIAL_SAMPLE_CLIPS[2]],
          },
          thumbnailUrl: INITIAL_SAMPLE_CLIPS[1]?.thumbnail,
          durationMs: 8000,
          updatedAt: Date.now() - 86400000,
        };
        const list = [defaultSaved, sample2];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return list;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse saved projects:', e);
      return [];
    }
  },

  saveProject(timeline: ProjectTimeline): void {
    try {
      const projects = this.getProjects();
      const durationMs = timeline.clips.reduce(
        (acc, c) => acc + (c.endTrimMs - c.startTrimMs) / (c.speed || 1),
        0
      );
      const thumbnail = timeline.clips[0]?.thumbnail || '';

      const existingIdx = projects.findIndex((p) => p.id === timeline.id);
      const entry: SavedProject = {
        id: timeline.id,
        name: timeline.name || 'Untitled Project',
        timeline,
        thumbnailUrl: thumbnail,
        durationMs,
        updatedAt: Date.now(),
      };

      if (existingIdx >= 0) {
        projects[existingIdx] = entry;
      } else {
        projects.unshift(entry);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(CURRENT_PROJECT_KEY, timeline.id);
    } catch (e) {
      console.warn('Failed to save project:', e);
    }
  },

  deleteProject(id: string): SavedProject[] {
    const projects = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects;
  },

  duplicateProject(id: string): SavedProject | null {
    const projects = this.getProjects();
    const source = projects.find((p) => p.id === id);
    if (!source) return null;

    const newId = `proj_${Date.now()}`;
    const duplicatedTimeline: ProjectTimeline = {
      ...JSON.parse(JSON.stringify(source.timeline)),
      id: newId,
      name: `${source.name} (Copy)`,
      updatedAt: Date.now(),
    };

    const newEntry: SavedProject = {
      id: newId,
      name: duplicatedTimeline.name,
      timeline: duplicatedTimeline,
      thumbnailUrl: source.thumbnailUrl,
      durationMs: source.durationMs,
      updatedAt: Date.now(),
    };

    projects.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newEntry;
  },

  createNewProjectWithClips(clips: TimelineClip[], projectName = 'New Video Project'): ProjectTimeline {
    const newTimeline: ProjectTimeline = {
      id: `proj_${Date.now()}`,
      name: projectName,
      aspectRatio: '9:16',
      clips,
      captions: [],
      stickers: [],
      bgAudio: {
        id: `audio_${Date.now()}`,
        title: 'Neon Drift (Phonk)',
        genre: 'phonk',
        volume: 0.5,
        isMuted: false,
        ducking: true,
        durationMs: 30000,
      },
      updatedAt: Date.now(),
    };

    this.saveProject(newTimeline);
    return newTimeline;
  },
};
