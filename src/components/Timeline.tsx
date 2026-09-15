import React, { useRef, useState } from 'react';
import {
  Scissors,
  Trash2,
  Copy,
  Plus,
  Volume2,
  VolumeX,
  Type,
  Music,
  Gauge,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sliders,
  Smile,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { AudioTrackItem, CaptionItem, StickerItem, TimelineClip } from '../types';

interface TimelineProps {
  clips: TimelineClip[];
  captions: CaptionItem[];
  stickers?: StickerItem[];
  bgAudio: AudioTrackItem | null;
  currentPlayheadMs: number;
  totalDurationMs: number;
  selectedClipId: string | null;
  onSelectClip: (id: string | null) => void;
  onSeek: (ms: number) => void;
  onSplitClip: (clipId: string, splitPointMs: number) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onTrimClip: (clipId: string, newStartMs: number, newEndMs: number) => void;
  onMoveClip?: (clipId: string, direction: 'left' | 'right') => void;
  onOpenClipInspector?: () => void;
  onChangeSpeed?: (clipId: string) => void;
  onChangeVolume?: (clipId: string) => void;
  onUpdateCaption: (id: string, text: string) => void;
  onDeleteCaption: (id: string) => void;
  onDeleteSticker?: (id: string) => void;
  onAddCaptionAtPlayhead: () => void;
  onAddMediaPrompt: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  clips,
  captions,
  stickers = [],
  bgAudio,
  currentPlayheadMs,
  totalDurationMs,
  selectedClipId,
  onSelectClip,
  onSeek,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
  onTrimClip,
  onMoveClip,
  onOpenClipInspector,
  onChangeSpeed,
  onChangeVolume,
  onUpdateCaption,
  onDeleteCaption,
  onDeleteSticker,
  onAddCaptionAtPlayhead,
  onAddMediaPrompt,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomScale, setZoomScale] = useState(0.06); // px per ms (0.06 = 60px per sec)
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);

  // Compute total width based on duration
  const timelineContentWidth = Math.max(700, Math.round(totalDurationMs * zoomScale) + 240);

  // Handle click/scrub on timeline
  const handleTimelineScrub = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const clickX = clientX - rect.left + scrollLeft - 60; // offset track headers
    const newMs = Math.max(0, Math.min(totalDurationMs, clickX / zoomScale));
    onSeek(newMs);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    handleTimelineScrub(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScrubbing) {
      handleTimelineScrub(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleTimelineScrub(e.touches[0].clientX);
    }
  };

  const selectedClipIndex = clips.findIndex((c) => c.id === selectedClipId);
  const selectedClip = selectedClipIndex !== -1 ? clips[selectedClipIndex] : null;

  return (
    <div className="w-full flex flex-col bg-[#12131b] border-t border-neutral-800 select-none overflow-hidden shrink-0">
      {/* Timeline Controls & Quick Action Bar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-neutral-800/80 bg-[#161822] text-xs text-neutral-300">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {selectedClip ? (
            <>
              {/* Split */}
              <button
                onClick={() => onSplitClip(selectedClip.id, currentPlayheadMs)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-cyan-400 font-medium active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                title="Split clip at playhead"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              {/* Adjust / Inspector */}
              {onOpenClipInspector && (
                <button
                  onClick={onOpenClipInspector}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 font-medium active:scale-95 transition-colors cursor-pointer border border-cyan-700/60"
                  title="Crop, Rotate, Color Adjustments & Transitions"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>
              )}

              {/* Move Left / Right in sequence */}
              {onMoveClip && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onMoveClip(selectedClip.id, 'left')}
                    disabled={selectedClipIndex <= 0}
                    className={`p-1 rounded-md border border-neutral-700 cursor-pointer ${
                      selectedClipIndex > 0 ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'opacity-40 cursor-not-allowed'
                    }`}
                    title="Move clip earlier"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMoveClip(selectedClip.id, 'right')}
                    disabled={selectedClipIndex >= clips.length - 1}
                    className={`p-1 rounded-md border border-neutral-700 cursor-pointer ${
                      selectedClipIndex < clips.length - 1 ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'opacity-40 cursor-not-allowed'
                    }`}
                    title="Move clip later"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Duplicate */}
              <button
                onClick={() => onDuplicateClip(selectedClip.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                title="Duplicate Clip"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>

              {/* Trim */}
              <button
                onClick={() => {
                  const newEnd = Math.max(selectedClip.startTrimMs + 1000, selectedClip.endTrimMs - 1000);
                  onTrimClip(selectedClip.id, selectedClip.startTrimMs, newEnd);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                title="Trim Clip"
              >
                <Scissors className="w-3.5 h-3.5 rotate-90" />
                <span>Trim</span>
              </button>

              {/* Speed */}
              {onChangeSpeed && (
                <button
                  onClick={() => onChangeSpeed(selectedClip.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-cyan-300 active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                  title="Change Clip Speed"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{selectedClip.speed}x</span>
                </button>
              )}

              {/* Volume */}
              {onChangeVolume && (
                <button
                  onClick={() => onChangeVolume(selectedClip.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                  title="Toggle Volume / Mute"
                >
                  {selectedClip.isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-neutral-200" />}
                  <span>{selectedClip.isMuted ? 'Muted' : `${Math.round(selectedClip.volume * 100)}%`}</span>
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => onDeleteClip(selectedClip.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-red-950/60 text-red-400 active:scale-95 transition-colors cursor-pointer border border-neutral-700"
                title="Delete Clip"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <span className="text-neutral-400 text-[11px]">Select a clip to split, adjust, or reorder</span>
          )}

          <div className="w-[1px] h-4 bg-neutral-700 mx-1"></div>

          <button
            onClick={onAddCaptionAtPlayhead}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-amber-300 active:scale-95 transition-colors cursor-pointer border border-neutral-700 text-[11px]"
            title="Add Subtitle Caption at Playhead"
          >
            <Type className="w-3.5 h-3.5" />
            <span>+ Caption</span>
          </button>

          <button
            onClick={onAddMediaPrompt}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 active:scale-95 transition-colors cursor-pointer border border-cyan-800/60 text-[11px]"
            title="Add Media to Timeline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Media</span>
          </button>
        </div>

        {/* Timeline Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomScale((prev) => Math.max(0.03, prev - 0.015))}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
            title="Zoom Out Timeline"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-neutral-400 font-mono w-7 text-center">
            {Math.round(zoomScale * 1000)}%
          </span>
          <button
            onClick={() => setZoomScale((prev) => Math.min(0.12, prev + 0.015))}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
            title="Zoom In Timeline"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Track Scrollable Timeline Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[180px] overflow-x-auto overflow-y-hidden select-none cursor-crosshair bg-[#0f1016]"
      >
        <div
          style={{ width: `${timelineContentWidth}px` }}
          className="relative h-full flex flex-col pl-[60px]"
        >
          {/* Time Ruler */}
          <div className="h-5 w-full border-b border-neutral-800/80 flex items-center relative text-[10px] font-mono text-neutral-400 pointer-events-none">
            {generateTimeRulerMarkers(totalDurationMs, zoomScale)}
          </div>

          {/* 1. Captions Track */}
          <div className="h-6 w-full border-b border-neutral-800/60 relative flex items-center bg-[#13141f]/60">
            <div className="absolute -left-[56px] w-[50px] flex items-center gap-1 text-[9px] font-semibold text-amber-400 tracking-wider">
              <Type className="w-3 h-3 shrink-0" />
              <span className="truncate">TEXT</span>
            </div>

            {captions.map((cap) => {
              const startX = cap.startMs * zoomScale;
              const width = Math.max(30, (cap.endMs - cap.startMs) * zoomScale);
              const isEditing = editingCaptionId === cap.id;

              return (
                <div
                  key={cap.id}
                  style={{ left: `${startX}px`, width: `${width}px` }}
                  className="absolute h-4.5 rounded px-1.5 text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center justify-between group overflow-hidden shadow-xs cursor-pointer hover:bg-amber-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCaptionId(cap.id);
                  }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={cap.text}
                      autoFocus
                      onBlur={(e) => {
                        onUpdateCaption(cap.id, e.target.value);
                        setEditingCaptionId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateCaption(cap.id, (e.target as HTMLInputElement).value);
                          setEditingCaptionId(null);
                        }
                      }}
                      className="w-full bg-black/80 text-white rounded px-1 text-[10px] outline-none"
                    />
                  ) : (
                    <span className="truncate">{cap.text}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCaption(cap.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1 cursor-pointer shrink-0"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* 2. Stickers / Overlay Track */}
          <div className="h-6 w-full border-b border-neutral-800/60 relative flex items-center bg-[#15121e]/60">
            <div className="absolute -left-[56px] w-[50px] flex items-center gap-1 text-[10px] font-semibold text-pink-400 tracking-wider">
              <Smile className="w-3 h-3" />
              <span>STK</span>
            </div>

            {stickers.map((stk) => {
              const startX = stk.startMs * zoomScale;
              const width = Math.max(35, (stk.endMs - stk.startMs) * zoomScale);

              return (
                <div
                  key={stk.id}
                  style={{ left: `${startX}px`, width: `${width}px` }}
                  className="absolute h-4.5 rounded px-1.5 text-[9px] font-medium bg-pink-500/20 text-pink-300 border border-pink-500/50 flex items-center justify-between group overflow-hidden shadow-xs cursor-pointer hover:bg-pink-500/30"
                >
                  <span className="truncate">{stk.content}</span>
                  {onDeleteSticker && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSticker(stk.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 ml-1 cursor-pointer shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3. Video Clips Track */}
          <div className="h-16 w-full border-b border-neutral-800/80 relative flex items-center bg-[#141620]">
            <div className="absolute -left-[56px] w-[50px] flex items-center gap-1 text-[10px] font-semibold text-cyan-400 tracking-wider">
              <span>VIDEO</span>
            </div>

            {/* Clips Strip */}
            <div className="relative h-full flex items-center">
              {clips.map((clip, index) => {
                const clipDurationMs = (clip.endTrimMs - clip.startTrimMs) / clip.speed;
                const width = Math.max(50, clipDurationMs * zoomScale);
                const isSelected = clip.id === selectedClipId;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(clip.id);
                    }}
                    style={{ width: `${width}px` }}
                    className={`relative h-[54px] rounded-lg mx-[2px] transition-all cursor-pointer flex flex-col justify-between p-1.5 overflow-hidden group shadow-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600/90 to-cyan-600/90 ring-2 ring-cyan-400 text-white shadow-cyan-500/20'
                        : 'bg-[#222533] hover:bg-[#2a2e40] text-neutral-200 border border-neutral-700/80'
                    }`}
                  >
                    {/* Clip Thumbnail/Pattern preview */}
                    {clip.thumbnail && (
                      <div
                        className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: `url(${clip.thumbnail})` }}
                      ></div>
                    )}

                    <div className="relative flex items-center justify-between z-10">
                      <span className="text-[11px] font-semibold truncate drop-shadow-xs max-w-[80%]">
                        {clip.name}
                      </span>
                      <span className="text-[9px] px-1 rounded bg-black/50 text-cyan-300 font-mono">
                        {clip.speed}x
                      </span>
                    </div>

                    <div className="relative flex items-center justify-between text-[9px] text-neutral-300 z-10">
                      <div className="flex items-center gap-1">
                        <span className="capitalize text-neutral-400">{clip.filter.replace('_', ' ')}</span>
                        {clip.transition && clip.transition !== 'none' && (
                          <span className="px-1 rounded bg-amber-500/30 text-amber-300 text-[8px] font-mono">
                            ✦ {clip.transition}
                          </span>
                        )}
                      </div>
                      <span className="font-mono">
                        {Math.round(clipDurationMs / 100) / 10}s
                      </span>
                    </div>

                    {/* Left & Right Trim Handles */}
                    {isSelected && (
                      <>
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2.5 bg-cyan-400/80 hover:bg-cyan-300 cursor-ew-resize flex items-center justify-center z-20"
                          title="Drag to trim start"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const newStart = Math.min(clip.endTrimMs - 1000, clip.startTrimMs + 500);
                            onTrimClip(clip.id, newStart, clip.endTrimMs);
                          }}
                        >
                          <div className="w-[1.5px] h-3 bg-black rounded"></div>
                        </div>
                        <div
                          className="absolute right-0 top-0 bottom-0 w-2.5 bg-cyan-400/80 hover:bg-cyan-300 cursor-ew-resize flex items-center justify-center z-20"
                          title="Drag to trim end"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const newEnd = Math.max(clip.startTrimMs + 1000, clip.endTrimMs - 500);
                            onTrimClip(clip.id, clip.startTrimMs, newEnd);
                          }}
                        >
                          <div className="w-[1.5px] h-3 bg-black rounded"></div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Background Audio Track */}
          <div className="h-7 w-full relative flex items-center bg-[#171424]">
            <div className="absolute -left-[56px] w-[50px] flex items-center gap-1 text-[9px] font-semibold text-purple-400 tracking-wider">
              <Music className="w-3 h-3 shrink-0" />
              <span className="truncate">AUDIO</span>
            </div>

            {bgAudio ? (
              <div
                style={{ width: `${totalDurationMs * zoomScale}px` }}
                className="h-5.5 rounded-md bg-purple-950/50 border border-purple-800/60 px-2 flex items-center justify-between text-[10px] text-purple-300"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  <span className="font-medium truncate">{bgAudio.title} ({bgAudio.genre.toUpperCase()})</span>
                </div>
                {/* Waveform graphic representation */}
                <div className="flex items-center gap-0.5 opacity-60">
                  <div className="w-0.5 h-2 bg-purple-300"></div>
                  <div className="w-0.5 h-3.5 bg-purple-300"></div>
                  <div className="w-0.5 h-1.5 bg-purple-300"></div>
                  <div className="w-0.5 h-4 bg-purple-300"></div>
                  <div className="w-0.5 h-2 bg-purple-300"></div>
                  <div className="w-0.5 h-3 bg-purple-300"></div>
                </div>
              </div>
            ) : (
              <span className="text-[10px] text-neutral-400 italic">No background audio loaded</span>
            )}
          </div>

          {/* Scrubbing Playhead Needle (Runs vertically across all tracks) */}
          <div
            style={{ left: `${60 + currentPlayheadMs * zoomScale}px` }}
            className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 pointer-events-none z-30 shadow-[0_0_10px_#00e5ff]"
          >
            {/* Playhead handle head */}
            <div className="absolute -top-1 -left-[6px] w-3.5 h-3.5 rounded-full bg-cyan-400 ring-2 ring-black shadow-md flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: Generate time ruler markers
function generateTimeRulerMarkers(totalMs: number, scale: number) {
  const seconds = Math.ceil(totalMs / 1000) + 2;
  const markers = [];
  for (let s = 0; s <= seconds; s++) {
    const left = s * 1000 * scale;
    markers.push(
      <div
        key={s}
        style={{ left: `${left}px` }}
        className="absolute top-0 bottom-0 flex flex-col justify-end pb-0.5 pl-1"
      >
        <span className="text-[9px] text-neutral-400 select-none">
          {s}s
        </span>
        <div className="w-[1px] h-1.5 bg-neutral-700"></div>
      </div>
    );
  }
  return markers;
}
