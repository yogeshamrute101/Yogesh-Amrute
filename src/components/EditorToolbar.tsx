import React, { useState } from 'react';
import {
  Play,
  Pause,
  Undo2,
  Redo2,
  Sparkles,
  SlidersHorizontal,
  Wand2,
  Share2,
  Music,
  Gauge,
  Layers,
  Ratio,
  Type,
  Video,
  FileText,
  Flame,
  Smile,
  Sliders
} from 'lucide-react';
import { AspectRatio, FilterType } from '../types';

interface EditorToolbarProps {
  isPlaying: boolean;
  canUndo: boolean;
  canRedo: boolean;
  aspectRatio: AspectRatio;
  currentFilter: FilterType;
  currentSpeed: number;
  hasSelectedClip?: boolean;
  onPlayPause: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  onChangeFilter: (filter: FilterType) => void;
  onChangeSpeed: (speed: number) => void;
  onOpenAiCoPilot: () => void;
  onOpenAiScriptWriter: () => void;
  onOpenSceneDetection?: () => void;
  onOpenStickerModal?: () => void;
  onOpenClipInspector?: () => void;
  onGenerateAutoCaptions: () => void;
  onOpenShareModal: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isPlaying,
  canUndo,
  canRedo,
  aspectRatio,
  currentFilter,
  currentSpeed,
  hasSelectedClip,
  onPlayPause,
  onUndo,
  onRedo,
  onChangeAspectRatio,
  onChangeFilter,
  onChangeSpeed,
  onOpenAiCoPilot,
  onOpenAiScriptWriter,
  onOpenSceneDetection,
  onOpenStickerModal,
  onOpenClipInspector,
  onGenerateAutoCaptions,
  onOpenShareModal,
}) => {
  const [activePanel, setActivePanel] = useState<'none' | 'aspect' | 'filters' | 'speed'>('none');

  const filters: { id: FilterType; label: string; previewColor: string }[] = [
    { id: 'none', label: 'Natural', previewColor: 'bg-neutral-600' },
    { id: 'cinematic', label: 'Cinematic', previewColor: 'bg-teal-700' },
    { id: 'cyberpunk', label: 'Cyberpunk', previewColor: 'bg-pink-600' },
    { id: 'warm_vintage', label: 'Vintage', previewColor: 'bg-amber-700' },
    { id: 'noir', label: 'B&W Noir', previewColor: 'bg-neutral-900' },
    { id: 'vibrant', label: 'Vibrant', previewColor: 'bg-orange-500' },
    { id: 'golden_hour', label: 'Golden', previewColor: 'bg-yellow-600' },
  ];

  const aspectRatios: { id: AspectRatio; label: string; icon: string; desc: string }[] = [
    { id: '9:16', label: '9:16', icon: '📱', desc: 'Reels / TikTok / Shorts' },
    { id: '1:1', label: '1:1', icon: '⏹️', desc: 'Instagram Feed' },
    { id: '16:9', label: '16:9', icon: '🖥️', desc: 'YouTube Standard' },
    { id: '4:5', label: '4:5', icon: '📸', desc: 'Social Portrait' },
  ];

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="w-full flex flex-col bg-[#141622] border-t border-neutral-800 shrink-0">
      {/* Dynamic Pop-up Drawer for Filters / Aspect / Speed */}
      {activePanel !== 'none' && (
        <div className="px-3 py-2.5 bg-[#1a1d2d] border-b border-neutral-700/80 flex items-center justify-between animate-in fade-in duration-200">
          {activePanel === 'aspect' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full py-0.5">
              <span className="text-[11px] font-semibold text-neutral-400 mr-1 shrink-0">Canvas Ratio:</span>
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => {
                    onChangeAspectRatio(ar.id);
                    setActivePanel('none');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    aspectRatio === ar.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span>{ar.icon}</span>
                  <span>{ar.label}</span>
                  <span className="text-[9px] opacity-75 hidden sm:inline">({ar.desc})</span>
                </button>
              ))}
            </div>
          )}

          {activePanel === 'filters' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full py-0.5 scrollbar-none">
              <span className="text-[11px] font-semibold text-neutral-400 mr-1 shrink-0">Color Grade:</span>
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onChangeFilter(f.id);
                    setActivePanel('none');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    currentFilter === f.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${f.previewColor}`}></span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          )}

          {activePanel === 'speed' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full py-0.5">
              <span className="text-[11px] font-semibold text-neutral-400 mr-1 shrink-0">Clip Speed:</span>
              {speedOptions.map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    onChangeSpeed(spd);
                    setActivePanel('none');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 transition-all cursor-pointer ${
                    currentSpeed === spd
                      ? 'bg-cyan-500 text-black font-bold shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {spd}x {spd < 1 ? '(Slo-Mo)' : spd > 1 ? '(Fast)' : ''}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setActivePanel('none')}
            className="text-xs text-neutral-400 hover:text-white px-2 cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Bottom Mobile Toolbar */}
      <div className="h-14 px-2 sm:px-4 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {/* Playback & Undo */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-md shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
          </button>

          <div className="flex items-center">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                canUndo ? 'text-neutral-200 hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                canRedo ? 'text-neutral-200 hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Aspect Ratio Button */}
          <button
            onClick={() => setActivePanel(activePanel === 'aspect' ? 'none' : 'aspect')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activePanel === 'aspect'
                ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500'
                : 'bg-neutral-850 text-neutral-300 border-neutral-700/80 hover:bg-neutral-800'
            }`}
          >
            <Ratio className="w-3.5 h-3.5" />
            <span>{aspectRatio}</span>
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setActivePanel(activePanel === 'filters' ? 'none' : 'filters')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activePanel === 'filters'
                ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500'
                : 'bg-neutral-850 text-neutral-300 border-neutral-700/80 hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="capitalize">{currentFilter === 'none' ? 'Filters' : currentFilter.replace('_', ' ')}</span>
          </button>

          {/* Speed Button */}
          <button
            onClick={() => setActivePanel(activePanel === 'speed' ? 'none' : 'speed')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              activePanel === 'speed'
                ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500'
                : 'bg-neutral-850 text-neutral-300 border-neutral-700/80 hover:bg-neutral-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{currentSpeed}x</span>
          </button>

          {/* Adjust / Inspector (when clip selected or general) */}
          {onOpenClipInspector && (
            <button
              onClick={onOpenClipInspector}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                hasSelectedClip
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/80 hover:bg-cyan-900/60'
                  : 'bg-neutral-850 text-neutral-300 border-neutral-700/80 hover:bg-neutral-800'
              }`}
              title="Crop, Rotate, Color Adjustments & Audio"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Adjust</span>
            </button>
          )}

          {/* Stickers & Badges Button */}
          {onOpenStickerModal && (
            <button
              onClick={onOpenStickerModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-850 text-pink-300 border border-neutral-700/80 hover:bg-neutral-800 transition-all cursor-pointer"
              title="Add Animated Stickers, Viral Badges & Emojis"
            >
              <Smile className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Stickers</span>
            </button>
          )}

          {/* AI Scene Highlights & Silence Removal */}
          {onOpenSceneDetection && (
            <button
              onClick={onOpenSceneDetection}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60 transition-all cursor-pointer"
              title="AI Highlight & Scene Detection"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Highlights</span>
            </button>
          )}

          {/* Auto Captions AI */}
          <button
            onClick={onGenerateAutoCaptions}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-850 text-amber-300 border border-neutral-700/80 hover:bg-neutral-800 transition-all cursor-pointer"
            title="Auto-generate synced viral subtitles"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Captions</span>
          </button>

          {/* AI Co-Pilot Button */}
          <button
            onClick={onOpenAiCoPilot}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer shadow-xs"
            title="Open AI Natural Language Co-Pilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Co-Pilot</span>
          </button>
        </div>

        {/* Share & Export */}
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          <button
            onClick={onOpenAiScriptWriter}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700/80 cursor-pointer hidden md:flex items-center gap-1 text-xs"
            title="AI Script-to-Video Generator"
          >
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>Script</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white shadow-md shadow-violet-600/30 transition-transform active:scale-95 cursor-pointer"
            title="Export & Share to Social Media"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
