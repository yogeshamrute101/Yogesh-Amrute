import { TimelineClip } from '../types';

export const INITIAL_SAMPLE_CLIPS: TimelineClip[] = [
  {
    id: 'clip_intro_creator',
    name: '01. Creator Hook',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60',
    startTrimMs: 0,
    endTrimMs: 4000,
    originalDurationMs: 15000,
    speed: 1.0,
    volume: 1.0,
    isMuted: false,
    filter: 'vibrant',
    transition: 'cut',
    category: 'creator',
  },
  {
    id: 'clip_urban_broll',
    name: '02. Neon City B-Roll',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop&q=60',
    startTrimMs: 1000,
    endTrimMs: 5000,
    originalDurationMs: 15000,
    speed: 1.15,
    volume: 0.8,
    isMuted: false,
    filter: 'cyberpunk',
    transition: 'zoom_in',
    category: 'urban',
  },
  {
    id: 'clip_vlog_lifestyle',
    name: '03. Action Lifestyle',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=60',
    startTrimMs: 500,
    endTrimMs: 4500,
    originalDurationMs: 15000,
    speed: 1.0,
    volume: 1.0,
    isMuted: false,
    filter: 'cinematic',
    transition: 'fade',
    category: 'vlog',
  },
];

export const STOCK_LIBRARY_CLIPS: {
  id: string;
  name: string;
  category: string;
  durationMs: number;
  url: string;
  thumbnail: string;
  recommendedFilter: TimelineClip['filter'];
}[] = [
  {
    id: 'stock_1',
    name: 'Tech Creator Vlog',
    category: 'Creator',
    durationMs: 6000,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60',
    recommendedFilter: 'vibrant',
  },
  {
    id: 'stock_2',
    name: 'Cinematic Landscape',
    category: 'Nature',
    durationMs: 8000,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=60',
    recommendedFilter: 'golden_hour',
  },
  {
    id: 'stock_3',
    name: 'Modern Studio Setup',
    category: 'Workspace',
    durationMs: 7000,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=300&auto=format&fit=crop&q=60',
    recommendedFilter: 'cinematic',
  },
  {
    id: 'stock_4',
    name: 'Street Motion & Lights',
    category: 'Urban',
    durationMs: 5000,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=60',
    recommendedFilter: 'cyberpunk',
  },
];
