import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  RotateCcw,
  Sparkles,
  Scissors,
  Sliders,
  Copy,
  Trash2,
  Gauge,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Music,
  Type,
  SlidersHorizontal,
  Smile,
  Zap,
  Flame,
  FileText,
} from 'lucide-react';
import {
  ProjectTimeline,
  FilterType,
  CaptionItem,
} from '../types';
import { bgAudioEngine } from '../utils/audioSynth';
import { VideoCanvasPlayer, VideoCanvasPlayerRef } from '../components/VideoCanvasPlayer';
import { Timeline } from '../components/Timeline';

export type ActiveCategoryTab = 'edit' | 'ai' | 'text' | 'audio' | 'effects' | 'captions';

interface EditorScreenProps {
  timeline: ProjectTimeline;
  selectedClipId: string | null;
  currentPlayheadMs: number;
  isPlaying: boolean;
  totalDurationMs: number;
  historyLength: number;
  redoHistoryLength: number;
  canvasPlayerRef: React.RefObject<VideoCanvasPlayerRef>;
  onNavigateHome: () => void;
  onOpenShareModal: () => void;
  onOpenAiCoPilot: () => void;
  onOpenAiReelMaker: () => void;
  onOpenAiScriptWriter: () => void;
  onOpenSceneDetection: () => void;
  onOpenClipInspector: () => void;
  onOpenStickerModal: () => void;
  onOpenMediaLibrary: () => void;
  onOpenCaptionsScreen: () => void;
  onOpenAudioScreen: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPlayPause: () => void;
  onSeek: (ms: number) => void;
  onStepPlayhead: (deltaMs: number) => void;
  onCycleAspectRatio: () => void;
  onCycleSpeed: () => void;
  onSelectClip: (id: string) => void;
  onSplitAtPlayhead: () => void;
  onDeleteSelectedClip: () => void;
  onDuplicateSelectedClip: () => void;
  onMoveClip: (clipId: string, direction: 'left' | 'right') => void;
  onTrimClip: (id: string, start: number, end: number) => void;
  onUpdateCaption: (id: string, text: string) => void;
  onDeleteCaption: (id: string) => void;
  onDeleteSticker: (id: string) => void;
  onAddCaptionAtPlayhead: () => void;
  onSelectFilter: (filter: FilterType) => void;
  onSelectAudioGenre: (genre: 'phonk' | 'lofi' | 'cinematic') => void;
  onInstantCutSilence: () => void;
  onGenerateAutoCaptions: () => void;
}

export default function EditorScreen({
  timeline,
  selectedClipId,
  currentPlayheadMs,
  isPlaying,
  totalDurationMs,
  historyLength,
  redoHistoryLength,
  canvasPlayerRef,
  onNavigateHome,
  onOpenShareModal,
  onOpenAiCoPilot,
  onOpenAiReelMaker,
  onOpenAiScriptWriter,
  onOpenSceneDetection,
  onOpenClipInspector,
  onOpenStickerModal,
  onOpenMediaLibrary,
  onOpenCaptionsScreen,
  onOpenAudioScreen,
  onUndo,
  onRedo,
  onPlayPause,
  onSeek,
  onStepPlayhead,
  onCycleAspectRatio,
  onCycleSpeed,
  onSelectClip,
  onSplitAtPlayhead,
  onDeleteSelectedClip,
  onDuplicateSelectedClip,
  onMoveClip,
  onTrimClip,
  onUpdateCaption,
  onDeleteCaption,
  onDeleteSticker,
  onAddCaptionAtPlayhead,
  onSelectFilter,
  onSelectAudioGenre,
  onInstantCutSilence,
  onGenerateAutoCaptions,
}: EditorScreenProps) {
  const [activeTab, setActiveTab] = useState<ActiveCategoryTab>('edit');

  const selectedClip =
    timeline.clips.find((c) => c.id === selectedClipId) || timeline.clips[0];

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#0c0e15]">
      {/* ======================================================== */}
      {/* 1. TOP HEADER:  ← Back | VIDOAI STUDIO | Undo Redo Export */}
      {/* ======================================================== */}
      <header className="h-12 px-3.5 bg-[#12141f] border-b border-neutral-800/80 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-wider bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              VIDOAI STUDIO
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60 font-semibold">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={historyLength === 0}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-1"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Undo</span>
          </button>

          <button
            onClick={onRedo}
            disabled={redoHistoryLength === 0}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-1"
            title="Redo"
          >
            <RotateCcw className="w-3.5 h-3.5 -scale-x-100" />
            <span className="hidden sm:inline text-[11px]">Redo</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 cursor-pointer transition-transform active:scale-95"
            title="Export Video"
          >
            <span>Export</span>
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. VIDEO PREVIEW AREA                                    */}
      {/* ======================================================== */}
      <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center overflow-hidden bg-[#07080c]">
        <VideoCanvasPlayer
          ref={canvasPlayerRef}
          clips={timeline.clips}
          captions={timeline.captions}
          stickers={timeline.stickers || []}
          currentPlayheadMs={currentPlayheadMs}
          totalDurationMs={totalDurationMs}
          aspectRatio={timeline.aspectRatio}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onOpenClipInspector={onOpenClipInspector}
        />

        {/* Visible ✨ AI Co-Pilot Button on Video Preview */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onOpenAiCoPilot}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#EC4899] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-white/20"
            title="Open VIDOAI Co-Pilot"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>✨ AI Co-Pilot</span>
          </button>
        </div>

        {/* Floating Timecode Pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono shadow-lg">
          <button
            onClick={onPlayPause}
            className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center justify-center"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-cyan-400" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-cyan-400 ml-0.5" />
            )}
          </button>
          <span className="text-white font-semibold">{formatTime(currentPlayheadMs)}</span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">{formatTime(totalDurationMs)}</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM TOOLBAR: Edit | AI | Text | Audio | Effects | Captions */}
      {/* ======================================================== */}
      <div className="w-full bg-[#12141f] border-t border-neutral-800/80 px-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 w-full overflow-x-auto scrollbar-none py-1.5">
          {[
            { id: 'edit', label: 'Edit', icon: Scissors },
            { id: 'ai', label: 'AI ✨', icon: Sparkles },
            { id: 'text', label: 'Text', icon: Type },
            { id: 'audio', label: 'Audio', icon: Music },
            { id: 'effects', label: 'Effects', icon: SlidersHorizontal },
            { id: 'captions', label: 'Captions', icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveCategoryTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CONTEXTUAL ACTION BAR FOR ACTIVE TAB                  */}
      {/* ======================================================== */}
      <div className="h-10 px-3 bg-[#151724] border-b border-neutral-800/70 flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none">
        {activeTab === 'edit' && (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onSplitAtPlayhead}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <Scissors className="w-3.5 h-3.5 text-cyan-400" />
              <span>Split</span>
            </button>
            <button
              onClick={onOpenClipInspector}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900/60 cursor-pointer shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Adjust</span>
            </button>
            <button
              onClick={onDuplicateSelectedClip}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-violet-400" />
              <span>Duplicate</span>
            </button>
            <button
              onClick={onDeleteSelectedClip}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-red-300 hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Delete</span>
            </button>
            <button
              onClick={onCycleSpeed}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>Speed: {selectedClip?.speed || 1}x</span>
            </button>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onOpenAiCoPilot}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ AI Co-Pilot</span>
            </button>
            <button
              onClick={onOpenAiReelMaker}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-pink-500 text-black hover:opacity-95 cursor-pointer shrink-0 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>AI Reel Maker</span>
            </button>
            <button
              onClick={onOpenAiScriptWriter}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span>AI Script</span>
            </button>
            <button
              onClick={onInstantCutSilence}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer shrink-0"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>Cut Silence</span>
            </button>
            <button
              onClick={onOpenSceneDetection}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-950/50 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60 cursor-pointer shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Highlights</span>
            </button>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onGenerateAutoCaptions}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Auto Captions</span>
            </button>
            <button
              onClick={onAddCaptionAtPlayhead}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Subtitle</span>
            </button>
            <button
              onClick={onOpenStickerModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-950/70 text-pink-300 border border-pink-700/60 hover:bg-pink-900/60 cursor-pointer shrink-0"
            >
              <Smile className="w-3.5 h-3.5 text-pink-400" />
              <span>Stickers</span>
            </button>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onOpenAudioScreen}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#00F0FF] text-black hover:bg-cyan-300 cursor-pointer shrink-0"
            >
              🎵 Studio →
            </button>
            <button
              onClick={() => onSelectAudioGenre('phonk')}
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer shrink-0 ${
                timeline.bgAudio?.genre === 'phonk'
                  ? 'bg-pink-500 text-black font-bold'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              ⚡ Phonk
            </button>
            <button
              onClick={() => onSelectAudioGenre('lofi')}
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer shrink-0 ${
                timeline.bgAudio?.genre === 'lofi'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              ☕ Lo-Fi
            </button>
            <button
              onClick={() => onSelectAudioGenre('cinematic')}
              className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer shrink-0 ${
                timeline.bgAudio?.genre === 'cinematic'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              🎬 Cinematic
            </button>

            <span className="w-px h-4 bg-neutral-700 mx-1 shrink-0" />

            {/* Quick Procedural SFX Audition Buttons */}
            <span className="text-[10px] text-neutral-400 uppercase font-semibold shrink-0">SFX:</span>
            {[
              { id: 'whoosh', label: '💨 Whoosh' },
              { id: 'flash', label: '⚡ Flash' },
              { id: 'pop', label: '💥 Pop' },
              { id: 'glitch', label: '👾 Glitch' },
              { id: 'bass_drop', label: '🔊 Drop' },
              { id: 'ding', label: '🔔 Ding' },
            ].map((sfx) => (
              <button
                key={sfx.id}
                onClick={() => bgAudioEngine.playSfx(sfx.id as any)}
                className="px-2 py-1 rounded-lg text-xs font-medium bg-neutral-800/80 text-neutral-300 hover:text-cyan-300 hover:bg-neutral-700 border border-neutral-700/50 cursor-pointer shrink-0 active:scale-95 transition-all"
                title={`Play procedural ${sfx.label}`}
              >
                {sfx.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="flex items-center gap-1.5 w-full">
            {(['none', 'cinematic', 'cyberpunk', 'warm_vintage', 'noir', 'vibrant'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => onSelectFilter(f)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium capitalize shrink-0 cursor-pointer ${
                  selectedClip?.filter === f
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'captions' && (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={onOpenCaptionsScreen}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EC4899] text-white hover:bg-pink-600 cursor-pointer shrink-0"
            >
              💬 Open Captions Studio →
            </button>
            <button
              onClick={onGenerateAutoCaptions}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Generate</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. MULTI-TRACK TIMELINE                                  */}
      {/* ======================================================== */}
      <div className="w-full shrink-0 bg-[#0d0f17]">
        <Timeline
          clips={timeline.clips}
          captions={timeline.captions}
          stickers={timeline.stickers || []}
          bgAudio={timeline.bgAudio}
          currentPlayheadMs={currentPlayheadMs}
          totalDurationMs={totalDurationMs}
          selectedClipId={selectedClipId}
          onSelectClip={onSelectClip}
          onSeek={onSeek}
          onSplitClip={(id, point) => onSplitAtPlayhead()}
          onDeleteClip={(id) => onDeleteSelectedClip()}
          onDuplicateClip={(id) => onDuplicateSelectedClip()}
          onMoveClip={onMoveClip}
          onOpenClipInspector={onOpenClipInspector}
          onTrimClip={onTrimClip}
          onUpdateCaption={onUpdateCaption}
          onDeleteCaption={onDeleteCaption}
          onDeleteSticker={onDeleteSticker}
          onAddCaptionAtPlayhead={onAddCaptionAtPlayhead}
          onAddMediaPrompt={onOpenMediaLibrary}
        />
      </div>

      {/* ======================================================== */}
      {/* 6. BOTTOM DOCK                                           */}
      {/* ======================================================== */}
      <div className="h-12 px-3 bg-[#11131e] border-t border-neutral-800 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMediaLibrary}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-semibold border border-neutral-700/80 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Clip</span>
          </button>
          <button
            onClick={onOpenAiCoPilot}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-black text-xs font-extrabold shadow-md shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Co-Pilot</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStepPlayhead(-200)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
            title="Step Back 200ms"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-md shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-black" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onStepPlayhead(200)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
            title="Step Forward 200ms"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onCycleAspectRatio}
            className="px-2 py-1 rounded-lg bg-neutral-850 hover:bg-neutral-800 border border-neutral-700/80 text-cyan-300 text-xs font-mono font-semibold cursor-pointer"
            title="Cycle Aspect Ratio"
          >
            {timeline.aspectRatio}
          </button>

          <button
            onClick={onCycleSpeed}
            className="px-2 py-1 rounded-lg bg-neutral-850 hover:bg-neutral-800 border border-neutral-700/80 text-amber-300 text-xs font-mono font-semibold cursor-pointer"
            title="Cycle Speed"
          >
            {selectedClip?.speed || 1}x
          </button>
        </div>
      </div>
    </div>
  );
}
