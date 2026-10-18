import React, { useState, useEffect, useRef } from 'react';
import { Play, Loader2, Video, AlertCircle, X, Download, PlusCircle } from 'lucide-react';
import { TimelineClip } from '../types';

interface AiVideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGeneratedClip: (clip: TimelineClip) => void;
}

export const AiVideoGeneratorModal: React.FC<AiVideoGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddGeneratedClip,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  // Timer for polling
  const pollingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        window.clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setStatus('Initializing generation...');
    setOutputUrl(null);
    setPredictionId(null);

    // Prompt user for cost warning
    const confirm = window.confirm(
      "Generating real AI video uses the Replicate API and incurs real costs.\n\nAre you sure you want to proceed?"
    );
    if (!confirm) {
      setLoading(false);
      setStatus(null);
      return;
    }

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to start video generation');
      }

      setPredictionId(data.predictionId);
      setStatus(`Generation started. Status: ${data.status}`);
      pollPrediction(data.predictionId);
    } catch (err: any) {
      console.error('Error starting video generation:', err);
      setErrorMsg(err.message || 'An error occurred while starting generation.');
      setLoading(false);
      setStatus(null);
    }
  };

  const pollPrediction = async (id: string) => {
    try {
      const res = await fetch(`/api/video/poll/${id}`);
      const data = await res.json();

      if (!res.ok || data.error && !data.status) {
         throw new Error(data.error || 'Polling failed');
      }

      setStatus(`Status: ${data.status}`);

      if (data.status === 'succeeded' && data.outputUrl) {
        setOutputUrl(data.outputUrl);
        setLoading(false);
        setStatus('Generation complete!');
      } else if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(`Generation ${data.status}: ${data.error || 'Unknown error'}`);
      } else {
        // Still processing, poll again after 3 seconds
        pollingTimerRef.current = window.setTimeout(() => pollPrediction(id), 3000);
      }
    } catch (err: any) {
      console.error('Polling error:', err);
      setErrorMsg(err.message || 'An error occurred while polling.');
      setLoading(false);
      setStatus(null);
    }
  };

  const handleAddToTimeline = () => {
    if (!outputUrl) return;

    // We don't necessarily know the duration, assume 3s for now, user can trim.
    const durationMs = 3000;

    const newClip: TimelineClip = {
      id: `ai_gen_${Date.now()}`,
      name: `Generated: ${prompt.substring(0, 15)}...`,
      videoUrl: outputUrl,
      startTrimMs: 0,
      endTrimMs: durationMs,
      originalDurationMs: durationMs,
      speed: 1.0,
      volume: 1.0,
      isMuted: false,
      filter: 'none',
      transition: 'none',
      category: 'creator',
    };

    onAddGeneratedClip(newClip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#121420] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Generate Real Video</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center hover:bg-neutral-700 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-800">
             <label className="text-xs font-semibold text-neutral-400 block mb-2">Video Prompt</label>
             <textarea
               className="w-full bg-[#0a0b10] border border-neutral-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors min-h-[100px] resize-none"
               placeholder="Describe the video you want to generate in detail..."
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               disabled={loading}
             />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-neutral-400 block mb-2">Aspect Ratio</label>
              <select
                className="w-full bg-[#0a0b10] border border-neutral-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                disabled={loading}
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Vertical</option>
                <option value="1:1">1:1 Square</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {status && !errorMsg && (
            <div className="p-3 bg-cyan-950/20 border border-cyan-900/50 rounded-xl flex items-center justify-between">
               <span className="text-xs text-cyan-300 font-medium">{status}</span>
               {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
            </div>
          )}

          {outputUrl && (
             <div className="space-y-3">
               <label className="text-xs font-semibold text-emerald-400 block">Generation Success!</label>
               <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black aspect-video relative flex items-center justify-center">
                  <video
                    src={outputUrl}
                    controls
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                  />
               </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/30">
          {!outputUrl ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                loading || !prompt.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Video...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          ) : (
             <button
              onClick={handleAddToTimeline}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add to Timeline</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
