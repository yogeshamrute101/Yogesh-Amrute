import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Wand2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Music,
  Maximize2,
  Zap,
  ListChecks,
  Sliders,
} from 'lucide-react';
import { AiCoPilotResult, ProjectTimeline, ValidationReport } from '../types';
import { validateAiOperations } from '../services/aiOperationValidator';
import { executeCommandTransaction } from '../services/commandTransaction';
import { GeminiProvider } from '../services/aiProvider/GeminiProvider';
import { AiEditPlanner, PlanAnalysis } from '../services/aiProvider/AiEditPlanner';

interface AiCoPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: ProjectTimeline;
  onApplyTransaction: (newTimeline: ProjectTimeline, auditLog: string[]) => void;
}

export const AiCoPilotModal: React.FC<AiCoPilotModalProps> = ({
  isOpen,
  onClose,
  timeline,
  onApplyTransaction,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<AiCoPilotResult | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [planAnalysis, setPlanAnalysis] = useState<PlanAnalysis | null>(null);
  const [destructiveConfirmed, setDestructiveConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Prompts directly from requirement specification:
  const exampleCommands = [
    { label: '• Remove silence', text: 'Remove silence from this video.' },
    { label: '• Make a Reel', text: 'Make a 9:16 viral Reel.' },
    { label: '• Add captions', text: 'Add captions to this video.' },
    { label: '• Make it 30 seconds', text: 'Make it 30 seconds.' },
    { label: '• Make it more cinematic', text: 'Make it more cinematic with color grade and music.' },
    { label: '• 15s Highlight', text: 'Make this video 15 seconds and add captions.' },
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setValidationReport(null);
    setPlanAnalysis(null);
    setDestructiveConfirmed(false);

    try {
      // Step 1: Query AI via GeminiProvider
      const res = await GeminiProvider.requestEdit({
        prompt: query,
        timeline,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'AI is temporarily unavailable.');
      }

      setLastResult(res.data as any);

      // Step 2: Strict Validation Engine
      const report = validateAiOperations(res.data.operations, timeline);
      setValidationReport(report);

      if (!report.isValid) {
        throw new Error(report.error || 'Operations failed timeline safety verification.');
      }

      // Step 3: High-level Plan Analysis & Destructive Operation Detection
      const analysis = AiEditPlanner.analyzePlan(report.validatedOperations, timeline);
      setPlanAnalysis(analysis);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'AI is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTransaction = () => {
    if (!validationReport || !validationReport.isValid) return;

    // If destructive operation is present and not confirmed, prompt user
    if (planAnalysis?.destructivePrompt && !destructiveConfirmed) {
      setErrorMsg('Please confirm the destructive operation before applying.');
      return;
    }

    // Step 4: Atomic timeline transaction (all or nothing)
    const tx = executeCommandTransaction(timeline, validationReport.validatedOperations);
    if (tx.success) {
      onApplyTransaction(tx.newTimeline, tx.auditLog);
      onClose();
    } else {
      setErrorMsg(`Transaction failed: ${tx.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0e1017] rounded-t-3xl sm:rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Obsidian Header with Neon Cyan and Violet Accents */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#131520]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F0FF] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">VIDOAI CO-PILOT 2.0</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-[#00F0FF] font-mono font-medium border border-cyan-500/30">
                  Atomic Timeline
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Natural-language editing with safety validation & atomic undo
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Natural Language Example Commands */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Natural-Language Commands:
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">1-tap to run</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {exampleCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(cmd.text);
                    handleSendPrompt(cmd.text);
                  }}
                  className="px-2.5 py-2 rounded-xl text-left bg-[#151724] hover:bg-[#1c1f30] text-[11px] text-neutral-300 hover:text-[#00F0FF] border border-neutral-800/80 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate">{cmd.label}</span>
                  <Wand2 className="w-3 h-3 text-neutral-500 group-hover:text-[#00F0FF] shrink-0 ml-1 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Tell VIDOAI what you want to do:
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell VIDOAI what you want to do..."
                rows={3}
                className="w-full bg-[#08090d] border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F0FF] transition-colors resize-none shadow-inner"
              />
              <button
                onClick={() => handleSendPrompt()}
                disabled={loading || !prompt.trim()}
                className={`absolute bottom-3 right-3 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  loading || !prompt.trim()
                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'bg-[#00F0FF] hover:bg-cyan-300 text-black shadow-md shadow-cyan-500/25 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Destructive Operation Confirmation Banner (Requirement 8) */}
          {planAnalysis?.destructivePrompt && !destructiveConfirmed && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Destructive Operation Verification</span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {planAnalysis.destructivePrompt}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setDestructiveConfirmed(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Destructive Edit
                </button>
                <button
                  onClick={() => {
                    setPlanAnalysis(null);
                    setValidationReport(null);
                    setLastResult(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Plan Preview Card (Requirement 9) */}
          {lastResult && validationReport && planAnalysis && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#121624] to-[#1a1528] border border-cyan-500/40 space-y-3.5 animate-in fade-in">
              {/* Header with intent and verification badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00F0FF]">
                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                  <span>{lastResult.intent}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Validated ({validationReport.appliedCount} ops)
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">{lastResult.explanation}</p>

              {/* Requirement 9: Show Plan Summary Checklist */}
              <div className="p-3 rounded-xl bg-[#0b0d14] border border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300">
                  <span className="flex items-center gap-1.5 text-[#00F0FF]">
                    <ListChecks className="w-3.5 h-3.5" />
                    Edit Plan Preview:
                  </span>
                  <span className="text-[10px] font-normal text-neutral-400">
                    Est. Duration: ~{Math.round(planAnalysis.estimatedDurationMs / 1000)}s
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {planAnalysis.summaryItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-neutral-200">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-[#00F0FF] flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low-Level Operations Pills */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Atomic Transaction Operations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {validationReport.validatedOperations.map((op, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#0a0b10] text-cyan-300 font-mono text-[10px] border border-cyan-500/30"
                    >
                      {op.type}
                      {op.thresholdDb ? ` (${op.thresholdDb}dB)` : ''}
                      {op.filter ? ` → ${op.filter}` : ''}
                      {op.speed ? ` → ${op.speed}x` : ''}
                      {op.aspectRatio ? ` → ${op.aspectRatio}` : ''}
                      {op.transition ? ` → ${op.transition}` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirement 9: Apply Changes & Cancel Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleApplyTransaction}
                  className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer transition-transform active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Changes</span>
                </button>
                <button
                  onClick={() => {
                    setPlanAnalysis(null);
                    setValidationReport(null);
                    setLastResult(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
