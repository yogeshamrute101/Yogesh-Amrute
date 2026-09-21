import React, { useState } from 'react';

interface CoPilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  clips: any[];
  currentPlayheadMs: number;
}

export const CoPilotPanel: React.FC<CoPilotPanelProps> = ({
  isOpen,
  onClose,
  clips,
  currentPlayheadMs,
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] rounded-2xl border border-cyan-500/30 bg-[#0b0f19] shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">
              ✨ VIDOAI Co-Pilot
            </h2>
            <p className="text-xs text-white/50">
              AI-powered video editing assistant
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Close Co-Pilot"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-sm text-cyan-200">
              👋 Hi! I'm your VIDOAI Co-Pilot.
            </p>
            <p className="text-xs text-white/60 mt-2">
              Tell me what you want to do with your video.
            </p>
          </div>

          <div className="mt-4 text-xs text-white/40">
            Timeline: {clips.length} clips · Playhead: {currentPlayheadMs}ms
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Co-Pilot to edit your video..."
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/50"
            />

            <button
              onClick={() => setMessage('')}
              className="px-4 rounded-xl bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoPilotPanel;
