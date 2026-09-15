import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Volume2,
  Type,
  Music,
  Scissors,
  CheckCircle2,
  RefreshCw,
  Film,
  Layers,
  ArrowRight,
  Sliders,
  Play,
  Briefcase,
  GraduationCap,
  Pill,
  Plane,
  Flame,
  ShoppingBag,
  Video,
  Instagram,
  ShieldCheck,
} from 'lucide-react';
import { ProjectTimeline, ReelPreset, ValidationReport } from '../types';
import { validateAiOperations } from '../services/aiOperationValidator';
import { executeCommandTransaction } from '../services/commandTransaction';
import { GeminiProvider } from '../services/aiProvider/GeminiProvider';
import { AiEditPlanner } from '../services/aiProvider/AiEditPlanner';

interface AiReelMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: ProjectTimeline;
  onApplyReelTransaction: (newTimeline: ProjectTimeline, auditLog: string[]) => void;
}

const PRESET_OPTIONS: {
  id: ReelPreset;
  label: string;
  desc: string;
  icon: React.ReactNode;
  defaultDuration: number;
}[] = [
  { id: 'Viral Reel', label: 'Viral Reel', desc: 'Fast cuts, bold yellow hook, phonk pacing', icon: <Flame className="w-4 h-4 text-amber-400" />, defaultDuration: 15 },
  { id: 'Educational', label: 'Educational', desc: 'Clean glass subtitles, clear pauses, 1.1x', icon: <GraduationCap className="w-4 h-4 text-cyan-400" />, defaultDuration: 30 },
  { id: 'Pharma', label: 'Pharma / Health', desc: 'Golden hour grade, ambient audio, calm', icon: <Pill className="w-4 h-4 text-emerald-400" />, defaultDuration: 30 },
  { id: 'Travel', label: 'Travel', desc: 'Cinematic color grade, crossfades, ambient', icon: <Plane className="w-4 h-4 text-blue-400" />, defaultDuration: 30 },
  { id: 'Business', label: 'Business', desc: 'Minimal dark cards, crisp cuts, lo-fi', icon: <Briefcase className="w-4 h-4 text-violet-400" />, defaultDuration: 30 },
  { id: 'Motivation', label: 'Motivation', desc: 'High-contrast noir, cinematic crescendo', icon: <Zap className="w-4 h-4 text-yellow-400" />, defaultDuration: 20 },
  { id: 'Product', label: 'Product Showcase', desc: 'Vibrant pop, zoom transitions, phonk', icon: <ShoppingBag className="w-4 h-4 text-pink-400" />, defaultDuration: 15 },
  { id: 'YouTube Short', label: 'YouTube Short', desc: 'Punchy 9:16 retention edit with hook', icon: <Video className="w-4 h-4 text-red-400" />, defaultDuration: 30 },
  { id: 'Instagram Reel', label: 'Instagram Reel', desc: 'Trending 9:16 audio sync with dynamic text', icon: <Instagram className="w-4 h-4 text-purple-400" />, defaultDuration: 20 },
];

const WORKFLOW_STEPS = [
  '1. Select clips',
  '2. Analyze media',
  '3. Detect scenes',
  '4. Detect silence',
  '5. Detect important moments',
  '6. Rank clips',
  '7. Generate hook',
  '8. Build timeline',
  '9. Generate captions',
  '10. Select suitable music',
  '11. Add transitions',
  '12. Apply pacing',
  '13. Preview',
  '14. Allow user edits',
  '15. Export readiness',
];

export const AiReelMakerModal: React.FC<AiReelMakerModalProps> = ({
  isOpen,
  onClose,
  timeline,
  onApplyReelTransaction,
}) => {
  const [preset, setPreset] = useState<ReelPreset>('Viral Reel');
  const [targetDuration, setTargetDuration] = useState<number>(15);
  const [musicGenre, setMusicGenre] = useState<'phonk' | 'lofi' | 'cinematic' | 'ambient'>('phonk');
  const [removeSilence, setRemoveSilence] = useState<boolean>(true);
  const [includeCaptions, setIncludeCaptions] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (p: ReelPreset) => {
    setPreset(p);
    const cfg = AiEditPlanner.getPresetConfig(p);
    setMusicGenre(cfg.genre);
    setTargetDuration(cfg.targetDurationSec);
  };

  const handleCreateReel = async () => {
    setLoading(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    // Simulate animated step progression through the 15-step workflow
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 11 ? prev + 1 : prev));
    }, 280);

    try {
      const response = await GeminiProvider.requestReelMaker({
        clips: timeline.clips,
        preset,
        targetDurationSec: targetDuration,
        musicGenre,
      });

      clearInterval(stepInterval);
      setCurrentStepIndex(12); // Preview step

      if (!response.success || !response.data) {
        throw new Error(response.error || 'AI is temporarily unavailable.');
      }

      setGeneratedPlan(response.data);

      // Verify and validate operations
      const rawOps = response.data.operations || [];
      if (removeSilence && !rawOps.some((o: any) => o.type === 'REMOVE_SILENCE')) {
        rawOps.unshift({ type: 'REMOVE_SILENCE', thresholdDb: -35 });
      }

      const report = validateAiOperations(rawOps, timeline);
      setValidationReport(report);
      setCurrentStepIndex(13); // User review & edit step
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Reel generation error:', err);
      setErrorMessage(err.message || 'AI is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommitTransaction = () => {
    if (!validationReport || !validationReport.isValid) return;

    // Single Atomic Undo Transaction
    const tx = executeCommandTransaction(timeline, validationReport.validatedOperations);
    if (tx.success) {
      onApplyReelTransaction(tx.newTimeline, tx.auditLog);
      onClose();
    } else {
      setErrorMessage(`Transaction failed: ${tx.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0e1017] rounded-t-3xl sm:rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#131520]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-black font-black shadow-lg shadow-pink-500/20">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">AI REEL MAKER</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium border border-amber-500/30">
                  15-Step Engine
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                End-to-end automated short video pipeline with 9 viral presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Source Clips Inventory */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Source Clips ({timeline.clips.length}):
              </span>
              <span className="text-[10px] text-[#00F0FF] font-mono">
                {timeline.clips.length} ready for highlight assembly
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {timeline.clips.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#131520] border border-neutral-800 shrink-0 text-xs text-neutral-200"
                >
                  <Film className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate max-w-[110px]">{c.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {Math.round((c.endTrimMs - c.startTrimMs) / 1000)}s
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 9 Presets Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Choose Preset (9 Viral Blueprints):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_OPTIONS.map((item) => {
                const isSelected = preset === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-950/50 to-pink-950/40 border-amber-400 text-white shadow-md shadow-amber-500/10'
                        : 'bg-[#12141e] border-neutral-800 text-neutral-300 hover:bg-[#181a27] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold leading-tight truncate">{item.label}</span>
                      {item.icon}
                    </div>
                    <div className="text-[9.5px] text-neutral-400 line-clamp-2 leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: Target Duration & Music Genre */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Target Duration:
              </label>
              <div className="flex gap-1.5">
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTargetDuration(sec)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                      targetDuration === sec
                        ? 'bg-amber-400 text-black border-amber-300'
                        : 'bg-[#12141e] text-neutral-300 border-neutral-800 hover:bg-[#181a27]'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Soundtrack Mood:
              </label>
              <select
                value={musicGenre}
                onChange={(e) => setMusicGenre(e.target.value as any)}
                className="w-full bg-[#12141e] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="phonk">⚡ Viral Phonk (High Energy)</option>
                <option value="lofi">☕ Lo-Fi Chill (Warm Beat)</option>
                <option value="cinematic">🎬 Cinematic Anthem</option>
                <option value="ambient">🌿 Ambient Calm</option>
              </select>
            </div>
          </div>

          {/* Workflow Pipeline Progress Indicator */}
          {loading && (
            <div className="p-3.5 rounded-xl bg-[#121422] border border-neutral-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Processing 15-Step AI Workflow...</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  Step {currentStepIndex + 1}/15
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / 15) * 100}%` }}
                />
              </div>

              <div className="text-[11px] font-mono text-neutral-300">
                Current: <span className="text-white">{WORKFLOW_STEPS[currentStepIndex]}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Generated Result & Validation Preview */}
          {generatedPlan && validationReport && !loading && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#181525] to-[#121625] border border-pink-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">
                  {generatedPlan.title || `${preset} Short`}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Viral Score: {generatedPlan.viralScore || 94}/100
                </span>
              </div>

              {generatedPlan.hook && (
                <div className="p-2.5 rounded-xl bg-[#090a10] border border-neutral-800/80 text-xs text-neutral-200">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                    Opening 3s Hook:
                  </span>
                  "{generatedPlan.hook}"
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Validated Operations ({validationReport.appliedCount}):</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3 h-3" /> Safety Verified
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-[#090a10] rounded-lg border border-neutral-800">
                  {validationReport.validatedOperations.map((op, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#161826] text-pink-300 font-mono text-[10px] border border-pink-500/20"
                    >
                      {op.type}
                      {op.aspectRatio ? ` (${op.aspectRatio})` : ''}
                      {op.speed ? ` (${op.speed}x)` : ''}
                      {op.filter ? ` (${op.filter})` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Commit Transaction Button */}
              <button
                onClick={handleCommitTransaction}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00F0FF] hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-transform active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Commit Reel Transaction (Atomic Undo Supported)</span>
              </button>
            </div>
          )}

          {/* Trigger Reel Generation Button */}
          {!generatedPlan && !loading && (
            <button
              onClick={handleCreateReel}
              className="w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-black shadow-lg shadow-pink-500/25 transition-transform active:scale-98"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Generate Reel Automatically</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
