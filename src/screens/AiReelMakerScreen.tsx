import React, { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  Sparkles,
  CheckCircle2,
  Film,
  Flame,
  GraduationCap,
  Briefcase,
  Plane,
  Pill,
  RefreshCw,
  Play,
  Sliders,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { AspectRatio, ProjectTimeline, ReelPreset, TimelineClip, ValidationReport } from '../types';
import { GeminiProvider } from '../services/aiProvider/GeminiProvider';
import { validateAiOperations } from '../services/aiOperationValidator';
import { executeCommandTransaction } from '../services/commandTransaction';
import { AiEditPlanner } from '../services/aiProvider/AiEditPlanner';

interface AiReelMakerScreenProps {
  onBack: () => void;
  timeline?: ProjectTimeline;
  onApplyReel?: (newTimeline: ProjectTimeline) => void;
  onNavigateToEditor?: () => void;
}

const PRESET_LIST: {
  id: ReelPreset;
  label: string;
  desc: string;
  icon: React.ReactNode;
  duration: number;
}[] = [
  { id: 'Viral Reel', label: 'Viral', desc: 'Fast cuts, bold yellow hook, phonk pacing', icon: <Flame className="w-4 h-4 text-amber-400" />, duration: 15 },
  { id: 'Educational', label: 'Educational', desc: 'Clean subtitles, paced pauses, 1.1x speed', icon: <GraduationCap className="w-4 h-4 text-cyan-400" />, duration: 30 },
  { id: 'Business', label: 'Business', desc: 'Minimal cards, crisp cuts, lo-fi groove', icon: <Briefcase className="w-4 h-4 text-violet-400" />, duration: 30 },
  { id: 'Travel', label: 'Travel', desc: 'Cinematic color grade, crossfades, ambient beat', icon: <Plane className="w-4 h-4 text-blue-400" />, duration: 30 },
  { id: 'Pharma', label: 'Pharma / Health', desc: 'Calm golden hour grade, ambient sound', icon: <Pill className="w-4 h-4 text-emerald-400" />, duration: 30 },
  { id: 'Motivation', label: 'Motivation', desc: 'High-contrast noir, cinematic crescendo', icon: <Zap className="w-4 h-4 text-yellow-400" />, duration: 20 },
];

export const AiReelMakerScreen: React.FC<AiReelMakerScreenProps> = ({
  onBack,
  timeline = {
    id: 'default',
    name: 'Untitled',
    aspectRatio: '9:16' as AspectRatio,
    clips: [],
    captions: [],
    stickers: [],
    bgAudio: null,
    updatedAt: Date.now(),
  },
  onApplyReel,
  onNavigateToEditor,
}) => {
  const safeClips = timeline?.clips || [];
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedPreset, setSelectedPreset] = useState<ReelPreset>('Viral Reel');
  const [targetDuration, setTargetDuration] = useState<number>(15);
  const [musicGenre, setMusicGenre] = useState<'phonk' | 'lofi' | 'cinematic' | 'ambient'>('phonk');
  const [removeSilence, setRemoveSilence] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    { num: 1, title: 'Select clips' },
    { num: 2, title: 'Analyze' },
    { num: 3, title: 'Choose style' },
    { num: 4, title: 'Generate' },
    { num: 5, title: 'Preview' },
    { num: 6, title: 'Export' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setActiveStep(2); // Analyzing

    setTimeout(() => {
      setActiveStep(4); // Generating
    }, 800);

    try {
      const response = await GeminiProvider.requestReelMaker({
        clips: timeline.clips,
        preset: selectedPreset,
        targetDurationSec: targetDuration,
        musicGenre,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'AI is temporarily unavailable.');
      }

      setGeneratedPlan(response.data);

      const rawOps = response.data.operations || [];
      if (removeSilence && !rawOps.some((o: any) => o.type === 'REMOVE_SILENCE')) {
        rawOps.unshift({ type: 'REMOVE_SILENCE', thresholdDb: -35 });
      }

      const report = validateAiOperations(rawOps, timeline);
      setValidationReport(report);
      setActiveStep(5); // Preview ready!
    } catch (err: any) {
      setErrorMsg(err.message || 'AI is temporarily unavailable.');
      setActiveStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAndEdit = () => {
    if (!validationReport || !validationReport.isValid) return;
    const tx = executeCommandTransaction(timeline, validationReport.validatedOperations);
    if (tx.success) {
      onApplyReel?.(tx.newTimeline);
      onNavigateToEditor?.();
    } else {
      setErrorMsg(`Transaction failed: ${tx.error}`);
    }
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
            <h1 className="text-sm font-bold tracking-wide text-white flex items-center gap-2">
              <span>AI REEL MAKER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Auto-Pipeline
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400">Transform timeline clips into a viral 9:16 short</p>
          </div>
        </div>
      </div>

      {/* 6-STEP BREADCRUMBS */}
      <div className="p-3 border-b border-neutral-900 bg-[#0C0E14] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                  activeStep === s.num
                    ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-black shadow-xs font-bold'
                    : activeStep > s.num
                    ? 'bg-neutral-800 text-emerald-400'
                    : 'bg-neutral-900 text-neutral-500'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.title}</span>
                {activeStep > s.num && <Check className="w-3 h-3" />}
              </div>
              {idx < steps.length - 1 && <span className="text-neutral-700 text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* STEP 1: Clip Inventory */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
            <span className="flex items-center gap-2 text-cyan-400">
              <Film className="w-4 h-4" />
              <span>1. Selected Media Clips ({safeClips.length})</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Aspect Ratio: {timeline.aspectRatio || '9:16'}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
            {safeClips.map((c) => (
              <div
                key={c.id}
                className="w-24 rounded-xl bg-neutral-900 border border-neutral-800 p-2 shrink-0 space-y-1"
              >
                <div className="w-full h-14 rounded-lg bg-neutral-800 overflow-hidden relative">
                  {c.thumbnail ? (
                    <img src={c.thumbnail} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Film className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-white truncate">{c.name}</div>
                <div className="text-[9px] text-neutral-400 font-mono">
                  {Math.round((c.endTrimMs - c.startTrimMs) / 1000)}s
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 3: Choose Style Presets */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
          <label className="text-xs font-bold text-amber-400 block">
            3. Choose Style Preset:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_LIST.map((item) => {
              const isSelected = selectedPreset === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedPreset(item.id);
                    setTargetDuration(item.duration);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-xs'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{item.label}</span>
                    {item.icon}
                  </div>
                  <div className="text-[9.5px] text-neutral-400 line-clamp-2 leading-tight">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                Duration Target:
              </label>
              <div className="flex gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {[15, 30, 60].map((s) => (
                  <button
                    key={s}
                    onClick={() => setTargetDuration(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetDuration === s ? 'bg-amber-400 text-black shadow-xs' : 'text-neutral-400'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                Music Genre:
              </label>
              <select
                value={musicGenre}
                onChange={(e) => setMusicGenre(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="phonk">⚡ Viral Phonk (High Energy)</option>
                <option value="lofi">☕ Lo-Fi Chill (Warm Beat)</option>
                <option value="cinematic">🎬 Cinematic Anthem</option>
                <option value="ambient">🌿 Ambient Calm</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* STEP 4 & 5: GENERATE & PREVIEW PLAN */}
        {loading ? (
          <div className="p-6 rounded-2xl bg-[#121420] border border-neutral-800 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <div className="text-xs font-bold text-white">
              {activeStep === 2 ? 'Analyzing media & detecting highlights...' : 'Building Reel Timeline & Captions...'}
            </div>
            <p className="text-[11px] text-neutral-400">
              Generating atomic edit operations with safe boundaries
            </p>
          </div>
        ) : generatedPlan && validationReport ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181525] to-[#121625] border border-pink-500/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{generatedPlan.title || 'AI Reel Generated'}</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Viral Score: {generatedPlan.viralScore || 94}/100
              </span>
            </div>

            {generatedPlan.hook && (
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs text-neutral-200">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  Opening 3s Hook:
                </span>
                "{generatedPlan.hook}"
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Validated Editing Pipeline ({validationReport.appliedCount} operations):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-black/40 rounded-xl border border-neutral-800">
                {validationReport.validatedOperations.map((op, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-neutral-900 text-pink-300 font-mono text-[10px] border border-pink-500/20"
                  >
                    {op.type}
                    {op.aspectRatio ? ` (${op.aspectRatio})` : ''}
                    {op.speed ? ` (${op.speed}x)` : ''}
                    {op.filter ? ` (${op.filter})` : ''}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyAndEdit}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#00F0FF] hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply to Timeline & Open in Editor</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>Generate Reel (4. Generate)</span>
          </button>
        )}
      </div>
    </div>
  );
};
