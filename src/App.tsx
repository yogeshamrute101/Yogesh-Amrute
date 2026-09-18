/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Smartphone,
  Maximize2,
  Share2,
  Plus,
  Play,
  Pause,
  Scissors,
  Copy,
  Trash2,
  SlidersHorizontal,
  Music,
  Type,
  Gauge,
  Ratio,
  MoreVertical,
  ArrowLeft,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Wand2,
  FileText,
  RotateCcw,
  Flame,
  Smile,
  Sliders
} from 'lucide-react';
import {
  AspectRatio,
  CaptionItem,
  FilterType,
  ProjectTimeline,
  TimelineClip,
  AiScriptResponse,
  AiEditOperation,
  StickerItem,
  AppScreen,
  SavedProject
} from './types';
import { INITIAL_SAMPLE_CLIPS } from './data/sampleClips';
import { bgAudioEngine } from './utils/audioSynth';
import { AndroidFrame } from './components/AndroidFrame';
import { VideoCanvasPlayer, VideoCanvasPlayerRef } from './components/VideoCanvasPlayer';
import { Timeline } from './components/Timeline';
import { AiCoPilotModal } from './components/AiCoPilotModal';
import { AiReelMakerModal } from './components/AiReelMakerModal';
import { AiScriptWriterModal } from './components/AiScriptWriterModal';
import { SocialShareModal } from './components/SocialShareModal';
import { MediaLibraryModal } from './components/MediaLibraryModal';
import { ClipInspectorModal } from './components/ClipInspectorModal';
import { StickerOverlayModal } from './components/StickerOverlayModal';
import { AiSceneDetectionModal } from './components/AiSceneDetectionModal';
import { validateAiOperations } from './services/aiOperationValidator';
import { executeCommandTransaction } from './services/commandTransaction';
import { HomeScreen } from './screens/HomeScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AiReelMakerScreen } from './screens/AiReelMakerScreen';
import { AiScriptScreen } from './screens/AiScriptScreen';
import { CaptionsScreen } from './screens/CaptionsScreen';
import { AudioScreen } from './screens/AudioScreen';
import { projectStorage } from './services/projectStorage';
import EditorScreen from './screens/EditorScreen';
import { Home, FolderOpen, Film, Settings as SettingsIcon } from 'lucide-react';

const INITIAL_TIMELINE: ProjectTimeline = {
  id: 'proj_vidoai_1',
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

type ActiveCategoryTab = 'edit' | 'ai' | 'text' | 'audio' | 'effects' | 'captions';

export default function App() {
  // Screen Navigation State ('home' | 'editor' | 'reel_maker' | 'script_writer' | 'captions' | 'audio' | 'projects' | 'settings')
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [recentProjects, setRecentProjects] = useState<SavedProject[]>(() => projectStorage.getProjects());
  const mediaFileInputRef = useRef<HTMLInputElement | null>(null);

  // Core Project State
  const [timeline, setTimeline] = useState<ProjectTimeline>(INITIAL_TIMELINE);
  const [history, setHistory] = useState<ProjectTimeline[]>([]);
  const [redoHistory, setRedoHistory] = useState<ProjectTimeline[]>([]);

  // Playhead Clock
  const [currentPlayheadMs, setCurrentPlayheadMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(INITIAL_SAMPLE_CLIPS[0].id);

  // Category Tab Selection: 'edit' | 'ai' | 'text' | 'audio' | 'effects' | 'captions'
  const [activeTab, setActiveTab] = useState<ActiveCategoryTab>('edit');

  // View Layout State (defaults to false = Edge-to-Edge full mobile view!)
  const [isDeviceMode, setIsDeviceMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modals
  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);
  const [isAiReelMakerOpen, setIsAiReelMakerOpen] = useState(false);
  const [isAiScriptWriterOpen, setIsAiScriptWriterOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isClipInspectorOpen, setIsClipInspectorOpen] = useState(false);
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);
  const [isSceneDetectionOpen, setIsSceneDetectionOpen] = useState(false);

  // Ephemeral Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasPlayerRef = useRef<VideoCanvasPlayerRef | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Restore autosaved project on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vidoai_studio_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.clips) && parsed.clips.length > 0) {
          setTimeline(parsed);
          setSelectedClipId(parsed.clips[0].id);
        }
      }
    } catch (e) {
      console.warn('Autosave restore skipped:', e);
    }
  }, []);

  // Autosave project on updates to projectStorage
  useEffect(() => {
    try {
      projectStorage.saveProject(timeline);
      setRecentProjects(projectStorage.getProjects());
    } catch (e) {
      // ignore
    }
  }, [timeline]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleCreateNewProjectWithFiles = async (files: FileList) => {
    try {
      const clips: TimelineClip[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const videoUrl = URL.createObjectURL(file);

        const durationMs = await new Promise<number>((resolve) => {
          const v = document.createElement('video');
          v.preload = 'metadata';
          v.src = videoUrl;
          v.onloadedmetadata = () => {
            resolve(Math.max(1000, Math.round((v.duration || 10) * 1000)));
          };
          v.onerror = () => {
            resolve(6000);
          };
        });

        clips.push({
          id: `clip_${Date.now()}_${i}`,
          name: file.name.replace(/\.[^/.]+$/, '') || `Clip ${i + 1}`,
          videoUrl,
          startTrimMs: 0,
          endTrimMs: durationMs,
          originalDurationMs: durationMs,
          speed: 1.0,
          volume: 1.0,
          isMuted: false,
          filter: 'none',
          transition: 'cut',
          category: 'uploaded',
        });
      }

      if (clips.length > 0) {
        const projName = (files[0].name.replace(/\.[^/.]+$/, '') || 'New') + ' Reel';
        const newProj = projectStorage.createNewProjectWithClips(clips, projName);
        pushHistory(newProj);
        setSelectedClipId(clips[0].id);
        setCurrentPlayheadMs(0);
        setRecentProjects(projectStorage.getProjects());
        setCurrentScreen('editor');
        showToast(`Created project with ${clips.length} video(s)!`);
      }
    } catch (err) {
      console.error('File load error:', err);
      showToast('Could not load video files.');
    }
  };

  const handleCreateEmptyProject = () => {
    pushHistory(INITIAL_TIMELINE);
    setSelectedClipId(INITIAL_TIMELINE.clips[0].id);
    setCurrentPlayheadMs(0);
    setCurrentScreen('editor');
    showToast('Loaded Sample Demo Project');
  };

  const totalDurationMs = timeline.clips.reduce(
    (acc, clip) => acc + (clip.endTrimMs - clip.startTrimMs) / clip.speed,
    0
  );

  // Undo / Redo Stack with Snapshot Push
  const pushHistory = useCallback(
    (newTimeline: ProjectTimeline) => {
      setHistory((prev) => [...prev.slice(-25), timeline]);
      setRedoHistory([]);
      setTimeline(newTimeline);
    },
    [timeline]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setRedoHistory((prev) => [timeline, ...prev]);
    setTimeline(previous);
    showToast('Undo applied');
  }, [history, timeline]);

  const handleRedo = useCallback(() => {
    if (redoHistory.length === 0) return;
    const next = redoHistory[0];
    setRedoHistory((prev) => prev.slice(1));
    setHistory((prev) => [...prev, timeline]);
    setTimeline(next);
    showToast('Redo applied');
  }, [redoHistory, timeline]);

  // Audio & Clock Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      bgAudioEngine.stop();
      return;
    }

    if (timeline.bgAudio && !timeline.bgAudio.isMuted) {
      bgAudioEngine.setGenre(timeline.bgAudio.genre);
      bgAudioEngine.setVolume(timeline.bgAudio.volume);
      bgAudioEngine.start();
    }

    lastTickTimeRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      setCurrentPlayheadMs((prev) => {
        const next = prev + delta;
        if (next >= totalDurationMs) {
          setIsPlaying(false);
          bgAudioEngine.stop();
          return 0;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      bgAudioEngine.stop();
    };
  }, [isPlaying, totalDurationMs, timeline.bgAudio]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPlayheadMs((prev) => Math.max(0, prev - 200));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentPlayheadMs((prev) => Math.min(totalDurationMs, prev + 200));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, totalDurationMs]);

  // Direct Edit Operations
  const handleSplitAtPlayhead = () => {
    let accumulated = 0;
    let targetIndex = -1;

    for (let i = 0; i < timeline.clips.length; i++) {
      const clipDuration = (timeline.clips[i].endTrimMs - timeline.clips[i].startTrimMs) / timeline.clips[i].speed;
      if (currentPlayheadMs >= accumulated && currentPlayheadMs <= accumulated + clipDuration) {
        targetIndex = i;
        break;
      }
      accumulated += clipDuration;
    }

    if (targetIndex === -1) {
      showToast('Position playhead over a clip to split');
      return;
    }

    const clip = timeline.clips[targetIndex];
    const offsetInClipMs = (currentPlayheadMs - accumulated) * clip.speed;
    const cutPointMs = clip.startTrimMs + offsetInClipMs;

    if (cutPointMs <= clip.startTrimMs + 400 || cutPointMs >= clip.endTrimMs - 400) {
      showToast('Position too close to clip edge');
      return;
    }

    const partA: TimelineClip = { ...clip, endTrimMs: cutPointMs };
    const partB: TimelineClip = {
      ...clip,
      id: `${clip.id}_split_${Date.now()}`,
      name: `${clip.name} (B)`,
      startTrimMs: cutPointMs,
    };

    const newClips = [...timeline.clips];
    newClips.splice(targetIndex, 1, partA, partB);

    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    setSelectedClipId(partB.id);
    showToast('✂ Clip split at playhead');
  };

  const handleDuplicateSelectedClip = () => {
    const clipId = selectedClipId || timeline.clips[0]?.id;
    if (!clipId) return;
    const clip = timeline.clips.find((c) => c.id === clipId);
    if (!clip) return;

    const copy: TimelineClip = {
      ...clip,
      id: `${clip.id}_copy_${Date.now()}`,
      name: `${clip.name} (Copy)`,
    };
    const index = timeline.clips.findIndex((c) => c.id === clipId);
    const newClips = [...timeline.clips];
    newClips.splice(index + 1, 0, copy);

    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    setSelectedClipId(copy.id);
    showToast('⎘ Clip duplicated');
  };

  const handleDeleteSelectedClip = () => {
    const clipId = selectedClipId || timeline.clips[0]?.id;
    if (timeline.clips.length <= 1) {
      showToast('Timeline must have at least 1 clip');
      return;
    }
    const newClips = timeline.clips.filter((c) => c.id !== clipId);
    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    setSelectedClipId(newClips[0]?.id || null);
    showToast('🗑 Clip removed');
  };

  // Reorder Clips in sequence (Move Left / Right)
  const handleMoveClip = (clipId: string, direction: 'left' | 'right') => {
    const idx = timeline.clips.findIndex((c) => c.id === clipId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= timeline.clips.length) return;

    const newClips = [...timeline.clips];
    const [moved] = newClips.splice(idx, 1);
    newClips.splice(targetIdx, 0, moved);

    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    showToast(`Clip shifted ${direction}`);
  };

  // Update Clip Properties (Transform, Color Adjustments, Transition, Volume)
  const handleUpdateClip = (clipId: string, partial: Partial<TimelineClip>) => {
    const newClips = timeline.clips.map((c) => (c.id === clipId ? { ...c, ...partial } : c));
    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    showToast('Clip settings saved');
  };

  // Sticker Handlers
  const handleAddSticker = (stickerData: Omit<StickerItem, 'id'>) => {
    const newSticker: StickerItem = {
      ...stickerData,
      id: `stk_${Date.now()}`,
    };
    pushHistory({
      ...timeline,
      stickers: [...(timeline.stickers || []), newSticker],
      updatedAt: Date.now(),
    });
    showToast(`Added sticker "${newSticker.content}"`);
  };

  const handleDeleteSticker = (id: string) => {
    pushHistory({
      ...timeline,
      stickers: (timeline.stickers || []).filter((s) => s.id !== id),
      updatedAt: Date.now(),
    });
    showToast('Sticker deleted');
  };

  // Apply AI Highlight Operations
  const handleApplyHighlightEdits = (operations: AiEditOperation[]) => {
    const report = validateAiOperations(operations, timeline);
    const tx = executeCommandTransaction(timeline, report.validatedOperations);
    if (tx.success) {
      pushHistory(tx.newTimeline);
      showToast('✨ AI Highlights & Silence Cut applied!');
    } else {
      showToast('Failed to apply highlights');
    }
  };

  // Instant 1-Tap Cut Silence (Technical Requirement Pipeline)
  const handleInstantCutSilence = () => {
    const report = validateAiOperations(
      [
        { type: 'REMOVE_SILENCE', thresholdDb: -35 },
        { type: 'SPEED', speed: 1.15 },
        { type: 'ADD_CAPTIONS', captionText: '⚡️ Silence Removed' },
      ],
      timeline
    );
    const tx = executeCommandTransaction(timeline, report.validatedOperations);
    if (tx.success) {
      pushHistory(tx.newTimeline);
      showToast('⚡ Cut silence (-35dB) & tightened speech!');
    }
  };

  // Aspect Ratio & Speed Cycle
  const handleCycleAspectRatio = () => {
    const ratios: AspectRatio[] = ['9:16', '1:1', '16:9', '4:5'];
    const currentIdx = ratios.indexOf(timeline.aspectRatio);
    const nextRatio = ratios[(currentIdx + 1) % ratios.length];
    pushHistory({
      ...timeline,
      aspectRatio: nextRatio,
      updatedAt: Date.now(),
    });
    showToast(`Aspect Ratio: ${nextRatio}`);
  };

  const handleCycleSpeed = () => {
    const speeds = [0.5, 1.0, 1.25, 1.5, 1.75, 2.0];
    const clip = timeline.clips.find((c) => c.id === selectedClipId) || timeline.clips[0];
    const currentSpeed = clip?.speed || 1.0;
    const currentIdx = speeds.indexOf(currentSpeed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];

    const newClips = timeline.clips.map((c) => {
      if (!selectedClipId || c.id === selectedClipId) {
        return { ...c, speed: nextSpeed };
      }
      return c;
    });
    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    showToast(`Speed: ${nextSpeed}x`);
  };

  // Filter selection
  const handleSelectFilter = (filter: FilterType) => {
    const newClips = timeline.clips.map((c) => {
      if (!selectedClipId || c.id === selectedClipId) {
        return { ...c, filter };
      }
      return c;
    });
    pushHistory({
      ...timeline,
      clips: newClips,
      updatedAt: Date.now(),
    });
    showToast(`Filter: ${filter.replace('_', ' ')}`);
  };

  // Audio genre switch
  const handleSelectAudioGenre = (genre: 'phonk' | 'lofi' | 'cinematic') => {
    pushHistory({
      ...timeline,
      bgAudio: {
        id: `bg_${Date.now()}`,
        title: `${genre.toUpperCase()} Beat Sync`,
        genre,
        volume: 0.6,
        isMuted: false,
        ducking: true,
        durationMs: totalDurationMs,
      },
      updatedAt: Date.now(),
    });
    showToast(`Audio: ${genre.toUpperCase()} beat synchronized`);
  };

  // Auto-captions 1-tap generator
  const handleGenerateAutoCaptions = async () => {
    showToast('Analyzing speech & generating synced captions...');
    try {
      const res = await fetch('/api/ai/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoDurationMs: totalDurationMs,
          contextText: timeline.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.captions) {
        const mapped: CaptionItem[] = data.captions.map((c: any) => ({
          id: c.id || `cap_${Math.random()}`,
          text: c.text,
          startMs: c.startMs,
          endMs: c.endMs,
          style: 'yellow_viral',
          position: 'bottom',
          highlightWord: c.highlightWord,
        }));
        pushHistory({
          ...timeline,
          captions: mapped,
          updatedAt: Date.now(),
        });
        showToast('✨ AI Synced captions generated!');
      }
    } catch (e) {
      console.error(e);
      showToast('Caption generation failed');
    }
  };

  // Apply Script Storyboard
  const handleApplyScriptToTimeline = (script: AiScriptResponse) => {
    const newCaptions: CaptionItem[] = [];
    let runningMs = 0;

    const newClips: TimelineClip[] = script.scenes.map((scene, i) => {
      const durationMs = scene.durationSec * 1000;
      const sample = INITIAL_SAMPLE_CLIPS[i % INITIAL_SAMPLE_CLIPS.length];

      newCaptions.push({
        id: `cap_scene_${i}`,
        text: scene.textOverlay,
        startMs: runningMs,
        endMs: runningMs + durationMs,
        style: 'yellow_viral',
        position: 'bottom',
      });
      runningMs += durationMs;

      return {
        id: `clip_scene_${i}_${Date.now()}`,
        name: `Scene ${i + 1}: ${scene.textOverlay}`,
        videoUrl: sample.videoUrl,
        thumbnail: sample.thumbnail,
        startTrimMs: 0,
        endTrimMs: durationMs,
        originalDurationMs: 15000,
        speed: 1.0,
        volume: 1.0,
        isMuted: false,
        filter: scene.recommendedFilter || 'vibrant',
        transition: scene.transition || 'cut',
        category: 'creator',
      };
    });

    pushHistory({
      ...timeline,
      name: script.title,
      aspectRatio: '9:16',
      clips: newClips,
      captions: newCaptions,
      bgAudio: {
        id: `bg_${Date.now()}`,
        title: script.backgroundMusicVibe,
        genre: 'phonk',
        volume: 0.6,
        isMuted: false,
        ducking: true,
        durationMs: runningMs,
      },
      updatedAt: Date.now(),
    });
    setCurrentPlayheadMs(0);
    showToast(`Reel loaded: "${script.title}"`);
  };

  // Format Milliseconds to 00:04 / 00:15
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const selectedClip = timeline.clips.find((c) => c.id === selectedClipId) || timeline.clips[0];

  return (
    <div className="w-screen h-screen flex flex-col bg-[#07080c] text-[#f1f3f9] overflow-hidden select-none font-sans">
      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-cyan-500 text-black font-semibold text-xs shadow-xl shadow-cyan-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container (Edge-to-Edge by default; framed when toggled) */}
      <AndroidFrame
        isDeviceMode={isDeviceMode}
        onToggleDeviceMode={() => setIsDeviceMode(!isDeviceMode)}
        projectName={timeline.name}
      >
        <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#0c0e15]">
          <div className="flex-1 w-full min-h-0 overflow-hidden relative">
            {currentScreen === 'home' && (
              <HomeScreen
                recentProjects={projectStorage.getProjects()}
                onNavigate={(screen) => setCurrentScreen(screen)}
                onOpenProject={(proj) => {
                  setTimeline(proj);
                  setCurrentPlayheadMs(0);
                  setCurrentScreen('editor');
                }}
                onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
                onDeleteProject={(id) => {
                  projectStorage.deleteProject(id);
                  showToast('Project deleted');
                }}
                onDuplicateProject={(id) => {
                  projectStorage.duplicateProject(id);
                  showToast('Project duplicated');
                }}
                onCreateNewProjectWithFiles={(files) => handleCreateNewProjectWithFiles(files)}
                onCreateEmptyProject={() => handleCreateEmptyProject()}
              />
            )}

            {currentScreen === 'editor' && (
              <EditorScreen
                timeline={timeline}
                selectedClipId={selectedClipId}
                currentPlayheadMs={currentPlayheadMs}
                isPlaying={isPlaying}
                totalDurationMs={totalDurationMs}
                historyLength={history.length}
                redoHistoryLength={redoHistory.length}
                canvasPlayerRef={canvasPlayerRef}
                onNavigateHome={() => setCurrentScreen('home')}
                onOpenShareModal={() => setIsShareModalOpen(true)}
                onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
                onOpenAiReelMaker={() => setCurrentScreen('reel_maker')}
                onOpenAiScriptWriter={() => setCurrentScreen('script_writer')}
                onOpenSceneDetection={() => setIsSceneDetectionOpen(true)}
                onOpenClipInspector={() => setIsClipInspectorOpen(true)}
                onOpenStickerModal={() => setIsStickerModalOpen(true)}
                onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
                onOpenCaptionsScreen={() => setCurrentScreen('captions')}
                onOpenAudioScreen={() => setCurrentScreen('audio')}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onSeek={(ms) => setCurrentPlayheadMs(ms)}
                onStepPlayhead={(deltaMs) =>
                  setCurrentPlayheadMs((prev) =>
                    Math.max(0, Math.min(totalDurationMs, prev + deltaMs))
                  )
                }
                onCycleAspectRatio={handleCycleAspectRatio}
                onCycleSpeed={handleCycleSpeed}
                onSelectClip={(id) => setSelectedClipId(id)}
                onSplitAtPlayhead={handleSplitAtPlayhead}
                onDeleteSelectedClip={handleDeleteSelectedClip}
                onDuplicateSelectedClip={handleDuplicateSelectedClip}
                onMoveClip={handleMoveClip}
                onTrimClip={(id, start, end) => {
                  const newClips = timeline.clips.map((c) =>
                    c.id === id ? { ...c, startTrimMs: start, endTrimMs: end } : c
                  );
                  pushHistory({ ...timeline, clips: newClips, updatedAt: Date.now() });
                }}
                onUpdateCaption={(id, text) => {
                  const newCaps = timeline.captions.map((c) =>
                    c.id === id ? { ...c, text } : c
                  );
                  pushHistory({ ...timeline, captions: newCaps, updatedAt: Date.now() });
                }}
                onDeleteCaption={(id) => {
                  const newCaps = timeline.captions.filter((c) => c.id !== id);
                  pushHistory({ ...timeline, captions: newCaps, updatedAt: Date.now() });
                }}
                onDeleteSticker={handleDeleteSticker}
                onAddCaptionAtPlayhead={() => {
                  const newCap = {
                    id: `cap_${Date.now()}`,
                    text: 'New Viral Hook ✍️',
                    startMs: currentPlayheadMs,
                    endMs: Math.min(totalDurationMs, currentPlayheadMs + 3000),
                    style: 'yellow_viral' as const,
                    position: 'bottom' as const,
                  };
                  pushHistory({
                    ...timeline,
                    captions: [...timeline.captions, newCap],
                    updatedAt: Date.now(),
                  });
                }}
                onSelectFilter={handleSelectFilter}
                onSelectAudioGenre={handleSelectAudioGenre}
                onInstantCutSilence={handleInstantCutSilence}
                onGenerateAutoCaptions={handleGenerateAutoCaptions}
              />
            )}

            {currentScreen === 'projects' && (
              <ProjectsScreen
                projects={projectStorage.getProjects()}
                onOpenProject={(proj) => {
                  setTimeline(proj);
                  setCurrentPlayheadMs(0);
                  setCurrentScreen('editor');
                }}
                onDeleteProject={(id) => {
                  projectStorage.deleteProject(id);
                  showToast('Project deleted');
                }}
                onDuplicateProject={(id) => {
                  projectStorage.duplicateProject(id);
                  showToast('Project duplicated');
                }}
                onNewProject={() => handleCreateEmptyProject()}
                onRenameProject={(id, newName) => {
                  const all = projectStorage.getProjects();
                  const p = all.find((x) => x.id === id);
                  if (p) {
                    projectStorage.saveProject({ ...p.timeline, name: newName });
                    showToast('Project renamed');
                  }
                }}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                defaultAspect={timeline.aspectRatio}
                onUpdateDefaultAspect={() => handleCycleAspectRatio()}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'reel_maker' && (
              <AiReelMakerScreen
                timeline={timeline}
                onApplyReel={(newTimeline) => {
                  pushHistory(newTimeline);
                  setCurrentScreen('editor');
                  showToast('AI Reel applied to timeline!');
                }}
                onNavigateToEditor={() => setCurrentScreen('editor')}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'script_writer' && (
              <AiScriptScreen
                timeline={timeline}
                onApplyScriptAsCaptions={(captions) => {
                  pushHistory({
                    ...timeline,
                    captions: [...timeline.captions, ...captions],
                    updatedAt: Date.now(),
                  });
                  setCurrentScreen('editor');
                  showToast('AI Script captions applied!');
                }}
                onNavigateToEditor={() => setCurrentScreen('editor')}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'captions' && (
              <CaptionsScreen
                timeline={timeline}
                onUpdateCaptions={(captions) => {
                  pushHistory({
                    ...timeline,
                    captions,
                    updatedAt: Date.now(),
                  });
                  showToast('Captions updated');
                }}
                onNavigateToEditor={() => setCurrentScreen('editor')}
                onBack={() => setCurrentScreen('editor')}
              />
            )}

            {currentScreen === 'audio' && (
              <AudioScreen
                timeline={timeline}
                currentPlayheadMs={currentPlayheadMs}
                onUpdateAudio={(audio) => {
                  pushHistory({ ...timeline, bgAudio: audio, updatedAt: Date.now() });
                  showToast('Audio settings updated');
                }}
                onNavigateToEditor={() => setCurrentScreen('editor')}
                onBack={() => setCurrentScreen('editor')}
              />
            )}
          </div>

          {/* Bottom Android Navigation Bar (Tabs: Home, Projects, Editor, Settings) */}
          <nav className="h-13 bg-[#0d0f17] border-t border-neutral-800/80 px-4 flex items-center justify-around z-40 shrink-0 select-none">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'home'
                  ? 'text-cyan-400 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen('projects')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'projects'
                  ? 'text-cyan-400 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FolderOpen className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Projects</span>
            </button>

            <button
              onClick={() => setCurrentScreen('editor')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'editor'
                  ? 'text-cyan-400 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Film className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Editor</span>
            </button>

            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'settings'
                  ? 'text-cyan-400 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <SettingsIcon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Settings</span>
            </button>
          </nav>
        </div>
      </AndroidFrame>

      {/* ======================================================== */}
      {/* 7. MODALS & WORKFLOW DRAWERS                             */}
      {/* ======================================================== */}
      {isAiCoPilotOpen && (
        <AiCoPilotModal
          isOpen={isAiCoPilotOpen}
          onClose={() => setIsAiCoPilotOpen(false)}
          timeline={timeline}
          onApplyTransaction={(newTimeline, auditLog) => {
            pushHistory(newTimeline);
            showToast('Co-Pilot Transaction Committed!');
          }}
        />
      )}

      {isAiReelMakerOpen && (
        <AiReelMakerModal
          isOpen={isAiReelMakerOpen}
          onClose={() => setIsAiReelMakerOpen(false)}
          timeline={timeline}
          onApplyReelTransaction={(newTimeline, auditLog) => {
            pushHistory(newTimeline);
            showToast('AI Reel Generated & Synced!');
          }}
        />
      )}

      {isAiScriptWriterOpen && (
        <AiScriptWriterModal
          isOpen={isAiScriptWriterOpen}
          onClose={() => setIsAiScriptWriterOpen(false)}
          onApplyScriptToTimeline={handleApplyScriptToTimeline}
        />
      )}

      {isShareModalOpen && (
        <SocialShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          timeline={timeline}
          canvasElement={canvasPlayerRef.current?.getCanvasElement() || null}
          totalDurationMs={totalDurationMs}
        />
      )}

      {isMediaLibraryOpen && (
        <MediaLibraryModal
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          onAddClipToTimeline={(clip) => {
            pushHistory({
              ...timeline,
              clips: [...timeline.clips, clip],
              updatedAt: Date.now(),
            });
            setSelectedClipId(clip.id);
            showToast(`Added "${clip.name}" to timeline`);
          }}
        />
      )}

      {isClipInspectorOpen && selectedClip && (
        <ClipInspectorModal
          isOpen={isClipInspectorOpen}
          onClose={() => setIsClipInspectorOpen(false)}
          clip={selectedClip}
          onUpdateClip={handleUpdateClip}
        />
      )}

      {isStickerModalOpen && (
        <StickerOverlayModal
          isOpen={isStickerModalOpen}
          onClose={() => setIsStickerModalOpen(false)}
          currentPlayheadMs={currentPlayheadMs}
          totalDurationMs={totalDurationMs}
          onAddSticker={handleAddSticker}
        />
      )}

      {isSceneDetectionOpen && (
        <AiSceneDetectionModal
          isOpen={isSceneDetectionOpen}
          onClose={() => setIsSceneDetectionOpen(false)}
          clips={timeline.clips}
          onApplyHighlightEdits={handleApplyHighlightEdits}
        />
      )}
    </div>
  );
}
