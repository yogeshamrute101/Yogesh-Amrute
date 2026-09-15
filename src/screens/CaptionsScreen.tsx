import React, { useState } from 'react';
import {
  ArrowLeft,
  Type,
  Sparkles,
  Plus,
  Trash2,
  Check,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { CaptionItem, CaptionStyle, ProjectTimeline } from '../types';

interface CaptionsScreenProps {
  onBack: () => void;
  timeline?: ProjectTimeline;
  onUpdateCaptions?: (captions: CaptionItem[]) => void;
  onNavigateToEditor?: () => void;
}

const CAPTION_STYLES: { id: CaptionStyle; label: string; preview: string; color: string }[] = [
  { id: 'yellow_viral', label: 'Yellow Viral', preview: 'VIRAL HOOK', color: '#FFE600' },
  { id: 'neon_cyber', label: 'Neon Cyber', preview: 'CYBERPUNK', color: '#00F0FF' },
  { id: 'clean_glass', label: 'Clean Glass', preview: 'Minimal Glass', color: '#FFFFFF' },
  { id: 'minimal_dark', label: 'Minimal Dark', preview: 'Dark Card', color: '#E2E8F0' },
  { id: 'comic_pop', label: 'Comic Pop', preview: 'COMIC POP', color: '#FF0055' },
];

export const CaptionsScreen: React.FC<CaptionsScreenProps> = ({
  onBack,
  timeline,
  onUpdateCaptions,
  onNavigateToEditor,
}) => {
  const [captions, setCaptions] = useState<CaptionItem[]>(timeline?.captions || []);
  const [activeStyle, setActiveStyle] = useState<CaptionStyle>('yellow_viral');
  const [activePosition, setActivePosition] = useState<'bottom' | 'center' | 'top'>('bottom');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAutoCaptions = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated: CaptionItem[] = [
        {
          id: `cap_${Date.now()}_1`,
          text: 'STOP SCROLLING! ⚠️',
          startMs: 0,
          endMs: 3200,
          style: activeStyle,
          position: activePosition,
          highlightWord: 'STOP',
        },
        {
          id: `cap_${Date.now()}_2`,
          text: 'This video editor does it ALL 📲',
          startMs: 3500,
          endMs: 7000,
          style: activeStyle,
          position: activePosition,
          highlightWord: 'ALL',
        },
        {
          id: `cap_${Date.now()}_3`,
          text: 'Auto Cuts • Subtitles • Reel Maker ✨',
          startMs: 7300,
          endMs: 11000,
          style: activeStyle,
          position: activePosition,
          highlightWord: 'SUBTITLES',
        },
      ];
      setCaptions(generated);
      setIsGenerating(false);
    }, 700);
  };

  const handleTextChange = (id: string, text: string) => {
    setCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, text } : c)));
  };

  const handleDelete = (id: string) => {
    setCaptions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddNew = () => {
    const lastEnd = captions.length > 0 ? captions[captions.length - 1].endMs : 0;
    const newCap: CaptionItem = {
      id: `cap_${Date.now()}`,
      text: 'New subtitle text here...',
      startMs: lastEnd + 200,
      endMs: lastEnd + 3000,
      style: activeStyle,
      position: activePosition,
    };
    setCaptions((prev) => [...prev, newCap]);
  };

  const handleApplyStyleToAll = (style: CaptionStyle) => {
    setActiveStyle(style);
    setCaptions((prev) => prev.map((c) => ({ ...c, style })));
  };

  const handleApplyPositionToAll = (pos: 'bottom' | 'center' | 'top') => {
    setActivePosition(pos);
    setCaptions((prev) => prev.map((c) => ({ ...c, position: pos })));
  };

  const handleSaveAndReturn = () => {
    onUpdateCaptions(captions);
    onNavigateToEditor();
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B10] text-white select-none overflow-y-auto pb-16">
      {/* HEADER */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-neutral-900 bg-[#0E1018] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">AUTO CAPTIONS</h1>
            <p className="text-[10px] text-neutral-400">Generate, edit & style video subtitles</p>
          </div>
        </div>

        <button
          onClick={handleSaveAndReturn}
          className="px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Save</span>
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* GENERATE ACTION BUTTON */}
        <button
          onClick={handleGenerateAutoCaptions}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Transcribing Speech & Timing...' : 'Generate Auto Captions'}</span>
        </button>

        {/* STYLING & POSITION CONTROLS */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300">Subtitle Style:</span>
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => handleApplyPositionToAll('top')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  activePosition === 'top' ? 'bg-cyan-500 text-black' : 'text-neutral-400'
                }`}
                title="Top"
              >
                <AlignVerticalJustifyStart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleApplyPositionToAll('center')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  activePosition === 'center' ? 'bg-cyan-500 text-black' : 'text-neutral-400'
                }`}
                title="Center"
              >
                <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleApplyPositionToAll('bottom')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  activePosition === 'bottom' ? 'bg-cyan-500 text-black' : 'text-neutral-400'
                }`}
                title="Bottom"
              >
                <AlignVerticalJustifyEnd className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {CAPTION_STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => handleApplyStyleToAll(st.id)}
                className={`p-2.5 rounded-xl text-center border cursor-pointer transition-all ${
                  activeStyle === st.id
                    ? 'bg-neutral-800 border-cyan-400 shadow-xs'
                    : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                <div
                  className="text-xs font-black uppercase truncate"
                  style={{ color: st.color }}
                >
                  {st.preview}
                </div>
                <div className="text-[9px] text-neutral-400 mt-1">{st.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CAPTION SEGMENTS LIST */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Caption Segments ({captions.length})
            </span>
            <button
              onClick={handleAddNew}
              className="text-xs text-[#00F0FF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Segment</span>
            </button>
          </div>

          {captions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#11131c] border border-neutral-800 text-center space-y-2">
              <Type className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No captions yet</p>
              <p className="text-[11px] text-neutral-500">
                Tap "Generate Auto Captions" to auto-sync subtitle timings.
              </p>
            </div>
          ) : (
            captions.map((cap, idx) => (
              <div
                key={cap.id}
                className="p-3 rounded-2xl bg-[#121420] border border-neutral-800 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Segment {idx + 1}</span>
                  <span>
                    {(cap.startMs / 1000).toFixed(1)}s - {(cap.endMs / 1000).toFixed(1)}s (
                    {Math.round((cap.endMs - cap.startMs) / 1000)}s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cap.text}
                    onChange={(e) => handleTextChange(cap.id, e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handleDelete(cap.id)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-950/30 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
