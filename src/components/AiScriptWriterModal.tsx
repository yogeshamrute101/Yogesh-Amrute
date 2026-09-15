import React, { useState } from 'react';
import { Sparkles, Clapperboard, Send, RefreshCw, CheckCircle, ArrowRight, Play, Hash } from 'lucide-react';
import { AiScriptResponse, ScriptScene } from '../types';

interface AiScriptWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScriptToTimeline: (script: AiScriptResponse) => void;
}

export const AiScriptWriterModal: React.FC<AiScriptWriterModalProps> = ({
  isOpen,
  onClose,
  onApplyScriptToTimeline,
}) => {
  const [topic, setTopic] = useState('Why AI video editing on mobile changes everything');
  const [style, setStyle] = useState('tech_creator');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState<AiScriptResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const styleOptions = [
    { id: 'tech_creator', label: 'Tech / Creator Tips' },
    { id: 'cinematic', label: 'Cinematic Storytelling' },
    { id: 'vlog', label: 'Lifestyle / Travel Vlog' },
    { id: 'humor', label: 'Punchy Humor / Skit' },
    { id: 'fitness', label: 'High-Energy Motivation' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          style,
          targetDuration: duration,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setScriptResult(data.data);
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating script');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadToTimeline = () => {
    if (scriptResult) {
      onApplyScriptToTimeline(scriptResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#151724] rounded-t-3xl sm:rounded-2xl border border-neutral-700/80 shadow-2xl flex flex-col overflow-hidden max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#1a1d2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI Script & Storyboard Studio</span>
              </h2>
              <p className="text-xs text-neutral-400">Generate viral scripts with automatic timeline assembly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Form Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Video Topic / Hook Idea:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 3 secret camera hacks for iPhone and Pixel users"
                className="w-full bg-[#0e0f16] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Pacing & Style:
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-[#0e0f16] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {styleOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Target Length:
                </label>
                <div className="flex gap-1.5">
                  {[15, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        duration === sec
                          ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                loading || !topic.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white shadow-md shadow-violet-600/30'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini Writing Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Storyboard</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Script Storyboard Preview */}
          {scriptResult && (
            <div className="space-y-3 pt-2 border-t border-neutral-800 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-violet-950/40 to-neutral-900 border border-violet-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white leading-snug max-w-[75%]">
                    {scriptResult.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Viral Score: {scriptResult.viralScore}/100
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-xs text-amber-300 font-medium">
                  🪝 <span className="text-neutral-300">Hook:</span> "{scriptResult.hook}"
                </div>

                <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>🎵 Music: {scriptResult.backgroundMusicVibe}</span>
                  <span>⏱️ ~{scriptResult.estimatedDuration}s duration</span>
                </div>
              </div>

              {/* Scenes Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Scene Breakdown ({scriptResult.scenes.length} Scenes):
                </span>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {scriptResult.scenes.map((scene, idx) => (
                    <div
                      key={scene.id || idx}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                        <span className="text-violet-400 font-bold">Scene {idx + 1} ({scene.durationSec}s)</span>
                        <span className="capitalize px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {scene.recommendedFilter}
                        </span>
                      </div>

                      <div className="text-neutral-200">
                        <span className="text-neutral-400 font-semibold">Visual:</span> {scene.visualDescription}
                      </div>

                      <div className="text-neutral-300 italic bg-black/30 p-1.5 rounded border border-white/5">
                        🗣️ "{scene.voiceover}"
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-cyan-300 font-medium">
                          Overlay: <strong className="text-yellow-300 font-bold">{scene.textOverlay}</strong>
                        </span>
                        <span className="text-neutral-400">Transition: {scene.transition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1.5">
                {scriptResult.suggestedHashtags.map((ht, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono"
                  >
                    {ht}
                  </span>
                ))}
              </div>

              {/* Action Button: Assemble to Timeline */}
              <button
                onClick={handleLoadToTimeline}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-transform active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Build Timeline from this Script</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
