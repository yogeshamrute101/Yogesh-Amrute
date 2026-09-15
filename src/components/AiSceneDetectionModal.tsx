import React, { useState } from 'react';
import { X, Sparkles, Flame, VolumeX, CheckCircle, ArrowRight, Loader2, Play } from 'lucide-react';
import { TimelineClip, SceneDetectionResult, AiEditOperation } from '../types';

interface AiSceneDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clips: TimelineClip[];
  onApplyHighlightEdits: (operations: AiEditOperation[]) => void;
}

export const AiSceneDetectionModal: React.FC<AiSceneDetectionModalProps> = ({
  isOpen,
  onClose,
  clips,
  onApplyHighlightEdits,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SceneDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDetection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/scene-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clips }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze scenes');
      }
      setAnalysis(data.data);
    } catch (err: any) {
      setError(err.message || 'Scene detection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBestMoments = () => {
    if (!analysis) return;
    const ops: AiEditOperation[] = [];

    // Silence removal
    ops.push({ type: 'REMOVE_SILENCE', thresholdDb: -32 });

    // Trim each clip to its highest scoring detected window
    analysis.scenes.forEach((sc) => {
      ops.push({
        type: 'TRIM',
        clipId: sc.clipId,
        newStartTrimMs: sc.startMs,
        newEndTrimMs: sc.endMs,
      });
    });

    onApplyHighlightEdits(ops);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#12131a] border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#161822]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">AI Scene & Best-Moment Detection</h3>
              <p className="text-[11px] text-neutral-400">Identify viral peaks & strip dull footage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-200">
          {!analysis && !isLoading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">Analyze {clips.length} Clips for Peak Moments</h4>
                <p className="text-neutral-400 max-w-xs mx-auto text-[11px] leading-relaxed">
                  Gemini analyzes visual motion vectors, pacing, and dead speech gaps to extract only high-retention segments.
                </p>
              </div>
              <button
                onClick={runDetection}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Scan Clips Now</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="font-medium text-white">Scanning audio waveforms and motion dynamics...</p>
              <p className="text-[11px] text-neutral-400">Detecting speech pauses and visual action highlights</p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-[11px] leading-relaxed">
                ✨ {analysis.summary}
              </div>

              {/* Detected Highlights */}
              <div>
                <span className="text-[11px] text-neutral-400 font-bold block mb-2">Detected High-Retention Scenes</span>
                <div className="space-y-2">
                  {analysis.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{scene.label}</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                            Score {scene.highlightScore}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400">
                          Window: {(scene.startMs / 1000).toFixed(1)}s - {(scene.endMs / 1000).toFixed(1)}s • Rec. Transition: {scene.recommendedTransition}
                        </p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Silence */}
              {analysis.silenceIntervals.length > 0 && (
                <div>
                  <span className="text-[11px] text-neutral-400 font-bold block mb-2">Dead-Space & Silence Intervals</span>
                  <div className="space-y-1.5">
                    {analysis.silenceIntervals.map((sil, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-red-950/20 border border-red-900/40 text-[11px]">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                          <span>{sil.reason}</span>
                        </div>
                        <span className="text-red-400 font-mono text-[10px]">
                          {(sil.startMs / 1000).toFixed(1)}s - {(sil.endMs / 1000).toFixed(1)}s
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {analysis && (
          <div className="p-4 border-t border-neutral-800 bg-[#14151e] flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyBestMoments}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Apply Best Moments & Trim</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
