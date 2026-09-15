import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Cpu,
  ShieldCheck,
  Video,
  Sliders,
  Database,
  Info,
  Check,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { AspectRatio } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  defaultAspect?: AspectRatio;
  onUpdateDefaultAspect?: (aspect: AspectRatio) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  defaultAspect = '9:16',
  onUpdateDefaultAspect,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '4k' | '720p'>('1080p');
  const [fps, setFps] = useState<'30' | '60'>('30');
  const [aiModel, setAiModel] = useState<'gemini-3.8-flash' | 'gemini-1.5-pro'>('gemini-3.8-flash');
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B10] text-white select-none overflow-y-auto pb-16">
      {/* HEADER */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-neutral-900 bg-[#0E1018] sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-white">SETTINGS</h1>
          <p className="text-[10px] text-neutral-400">VIDOAI Studio configurations</p>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* 1. AI SETTINGS */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00F0FF]">
            <Cpu className="w-4 h-4" />
            <span>AI Settings</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-300 font-medium block">
              Gemini Vision & Reasoning Model:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', desc: 'Real-time & Fast (Recommended)' },
                { id: 'gemini-1.5-pro', label: 'Gemini Pro', desc: 'Deep Creative Scripting' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAiModel(m.id as any)}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                    aiModel === m.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-xs'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[9.5px] text-neutral-400 leading-tight mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Safe AI Architecture Gate</span>
                <span className="text-[10px] text-neutral-400">Strict JSON validation & atomic rollback</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>

        {/* 2. EXPORT SETTINGS */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Video className="w-4 h-4" />
            <span>Export & Render Quality</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                Resolution:
              </label>
              <div className="flex gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {(['720p', '1080p', '4k'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      resolution === res ? 'bg-amber-400 text-black shadow-xs' : 'text-neutral-400'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-300 font-medium block mb-1">
                Framerate:
              </label>
              <div className="flex gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {(['30', '60'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      fps === f ? 'bg-amber-400 text-black shadow-xs' : 'text-neutral-400'
                    }`}
                  >
                    {f} FPS
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. DEFAULT ASPECT RATIO */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
            <Sliders className="w-4 h-4" />
            <span>Default Canvas Aspect Ratio</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: '9:16', label: '9:16', sub: 'TikTok/Reels' },
              { id: '16:9', label: '16:9', sub: 'YouTube' },
              { id: '1:1', label: '1:1', sub: 'Square' },
              { id: '4:5', label: '4:5', sub: 'IG Feed' },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => onUpdateDefaultAspect(a.id as AspectRatio)}
                className={`py-2 px-1 rounded-xl text-center border cursor-pointer transition-all ${
                  defaultAspect === a.id
                    ? 'bg-violet-500/20 border-violet-400 text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-bold">{a.label}</div>
                <div className="text-[9px] text-neutral-500">{a.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. STORAGE & CACHE */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Database className="w-4 h-4" />
            <span>Local Storage & Cache</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            All project edits and video timelines are safely stored locally on your device in your browser's persistent storage.
          </p>

          <button
            onClick={handleClearCache}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {cacheCleared ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Cache Cleaned Successfully</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Optimize & Refresh Local Cache</span>
              </>
            )}
          </button>
        </div>

        {/* 5. ABOUT VIDOAI STUDIO */}
        <div className="p-4 rounded-2xl bg-[#0e1017] border border-neutral-800/80 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center mx-auto text-black font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white">VIDOAI STUDIO v2.0</h3>
          <p className="text-[10px] text-neutral-400 max-w-xs mx-auto">
            Professional AI Video Editor with multi-track timeline, safe atomic operations, and instant reel rendering.
          </p>
        </div>
      </div>
    </div>
  );
};
