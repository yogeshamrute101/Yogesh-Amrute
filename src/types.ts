export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';

export type FilterType = 
  | 'none'
  | 'cinematic'
  | 'cyberpunk'
  | 'warm_vintage'
  | 'noir'
  | 'vibrant'
  | 'golden_hour';

export type TransitionType = 
  | 'none' 
  | 'cut' 
  | 'fade' 
  | 'dissolve' 
  | 'wipe' 
  | 'zoom_in' 
  | 'slide_left' 
  | 'glitch'
  | 'flash';

export type CaptionStyle = 
  | 'yellow_viral' 
  | 'minimal_dark' 
  | 'neon_cyber' 
  | 'comic_pop' 
  | 'clean_glass';

export interface ClipTransform {
  scale: number;           // 0.5 to 3.0
  rotation: number;        // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ColorAdjustments {
  brightness: number;   // -100 to 100 (default 0)
  contrast: number;     // -100 to 100 (default 0)
  saturation: number;   // -100 to 100 (default 0)
  exposure: number;     // -100 to 100 (default 0)
  vignette: number;     // 0 to 100 (default 0)
  warmth: number;       // -100 to 100 (default 0)
}

export interface StickerItem {
  id: string;
  type?: string;        // 'emoji' | 'badge' | 'arrow' | 'label'
  content: string;      // Emoji or badge text
  startMs: number;
  endMs: number;
  x: number;            // 0 - 100%
  y: number;            // 0 - 100%
  scale: number;        // 0.5 - 2.5
  rotation: number;     // -180 to 180 deg
  animation: 'pop' | 'pulse' | 'slide' | 'none';
}

export interface TimelineClip {
  id: string;
  name: string;
  videoUrl: string;
  thumbnail?: string;
  startTrimMs: number;
  endTrimMs: number;
  originalDurationMs: number;
  speed: number;
  volume: number;
  isMuted: boolean;
  filter: FilterType;
  transition: TransitionType;
  transform?: ClipTransform;
  colorAdjustments?: ColorAdjustments;
  fadeInMs?: number;
  fadeOutMs?: number;
  category?: 'creator' | 'broll' | 'urban' | 'vlog' | 'recorded' | 'uploaded';
}

export interface CaptionItem {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  style: CaptionStyle;
  position: 'top' | 'center' | 'bottom';
  highlightWord?: string;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  genre: 'phonk' | 'lofi' | 'cinematic' | 'ambient';
  volume: number;
  isMuted: boolean;
  ducking: boolean;
  durationMs: number;
  fadeInMs?: number;
  fadeOutMs?: number;
}

export interface SavedProject {
  id: string;
  name: string;
  timeline: ProjectTimeline;
  thumbnailUrl?: string;
  durationMs: number;
  updatedAt: number;
}

export type AppScreen =
  | 'home'
  | 'editor'
  | 'reel_maker'
  | 'script_writer'
  | 'captions'
  | 'audio'
  | 'projects'
  | 'settings';

export interface ProjectTimeline {
  id: string;
  name: string;
  aspectRatio: AspectRatio;
  clips: TimelineClip[];
  captions: CaptionItem[];
  stickers: StickerItem[];
  bgAudio: AudioTrackItem | null;
  updatedAt: number;
}

export interface ScriptScene {
  id: string;
  startTimeSec: number;
  durationSec: number;
  visualDescription: string;
  voiceover: string;
  textOverlay: string;
  recommendedFilter: FilterType;
  transition: TransitionType;
}

export interface AiScriptResponse {
  title: string;
  hook: string;
  estimatedDuration: number;
  viralScore: number;
  targetAspect: string;
  backgroundMusicVibe: string;
  scenes: ScriptScene[];
  suggestedHashtags: string[];
  callToAction: string;
}

export type SupportedOpType =
  | 'TRIM'
  | 'SPLIT'
  | 'DELETE'
  | 'MOVE'
  | 'DUPLICATE'
  | 'SPEED'
  | 'VOLUME'
  | 'MUTE'
  | 'ROTATE'
  | 'CROP'
  | 'FILTER'
  | 'TRANSITION'
  | 'TEXT'
  | 'CAPTION'
  | 'AUDIO'
  | 'REMOVE_SILENCE'
  | 'DETECT_SCENES'
  | 'CREATE_REEL'
  | 'CHANGE_ASPECT_RATIO'
  // Legacy aliases for backward compatibility
  | 'ASPECT_RATIO'
  | 'ADD_CAPTIONS'
  | 'ADD_AUDIO'
  | 'MOVE_CLIP'
  | 'MAKE_REEL'
  | 'TRANSFORM'
  | 'COLOR_ADJUST'
  | 'ADD_STICKER'
  | 'BEAT_SYNC';

export interface AiCropValues {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AiEditOperation {
  type: SupportedOpType;
  clipIndex?: number;
  clipId?: string;
  // Timing parameters
  startMs?: number;
  endMs?: number;
  newStartTrimMs?: number;
  newEndTrimMs?: number;
  splitAtMs?: number;
  // Numeric values
  value?: number;
  speed?: number;
  volume?: number;
  degrees?: number;
  rotation?: number;
  // Crop & Transform
  crop?: AiCropValues;
  transform?: Partial<ClipTransform>;
  colorAdjustments?: Partial<ColorAdjustments>;
  // Flags & state
  enabled?: boolean;
  isMuted?: boolean;
  muted?: boolean;
  dynamic?: boolean;
  // Aesthetics & Media
  filter?: FilterType;
  name?: string;
  transition?: TransitionType;
  content?: string;
  text?: string;
  captionText?: string;
  style?: CaptionStyle | string;
  genre?: 'phonk' | 'lofi' | 'cinematic' | 'ambient';
  audioVibe?: string;
  aspectRatio?: AspectRatio;
  thresholdDb?: number;
  sensitivity?: number;
  targetDurationSec?: number;
  preset?: ReelPreset | string;
  // Indices
  fromIndex?: number;
  toIndex?: number;
  sticker?: Omit<StickerItem, 'id'>;
  // Destructive marker
  isDestructive?: boolean;
}

export type ReelPreset =
  | 'Viral Reel'
  | 'Educational'
  | 'Pharma'
  | 'Travel'
  | 'Business'
  | 'Motivation'
  | 'Product'
  | 'YouTube Short'
  | 'Instagram Reel';

export interface AiPlanItem {
  id: string;
  description: string;
  opType: SupportedOpType;
  isDestructive?: boolean;
  confirmed?: boolean;
  icon?: string;
}

export interface ValidationReport {
  isValid: boolean;
  validatedOperations: AiEditOperation[];
  warnings: string[];
  appliedCount: number;
  error?: string;
  destructivePrompt?: string | null;
}

export interface ReelMakerOptions {
  preset: ReelPreset;
  vibe?: 'viral_trend' | 'cinematic_story' | 'high_energy_hype' | 'aesthetic_vlog';
  targetDurationSec: number;
  includeCaptions: boolean;
  removeSilence: boolean;
  musicGenre: 'phonk' | 'lofi' | 'cinematic' | 'ambient';
}

export interface AiCoPilotResult {
  intent: string;
  explanation: string;
  operations: AiEditOperation[];
  warnings?: string[];
  planSummary?: string[];
  destructiveWarning?: string | null;
  recommendedTitle?: string;
  tips?: string;
}

export interface SocialPlatformData {
  caption: string;
  hashtags: string[];
  recommendedSound?: string;
  engagementQuestion?: string;
  title?: string;
  description?: string;
  tags?: string[];
  tweet?: string;
}

export interface SocialPackageResponse {
  viralScore: number;
  bestTimeToPost: string;
  retentionTip: string;
  tiktok: SocialPlatformData;
  instagram: SocialPlatformData;
  youtubeShorts: SocialPlatformData;
  xTwitter: SocialPlatformData;
}

export interface ExportSettings {
  aspectRatio: AspectRatio;
  resolution: '720p' | '1080p' | '4k';
  fps: 24 | 30 | 60;
  quality: 'standard' | 'high' | 'ultra';
}

export interface SceneDetectionResult {
  summary: string;
  scenes: {
    clipId: string;
    startMs: number;
    endMs: number;
    label: string;
    highlightScore: number;
    recommendedTransition: TransitionType;
  }[];
  silenceIntervals: {
    clipId: string;
    startMs: number;
    endMs: number;
    reason: string;
  }[];
}
