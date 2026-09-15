import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Sliders, 
  Sun, 
  Eye, 
  Volume2, 
  Layers, 
  Check, 
  Sparkles,
  Scissors
} from 'lucide-react';
import { TimelineClip, FilterType, TransitionType, ClipTransform, ColorAdjustments } from '../types';
import { bgAudioEngine } from '../utils/audioSynth';

interface ClipInspectorModalProps {
  clip: TimelineClip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClip: (updated: TimelineClip) => void;
}

export const ClipInspectorModal: React.FC<ClipInspectorModalProps> = ({
  clip,
  isOpen,
  onClose,
  onUpdateClip,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'transform' | 'color' | 'transition' | 'audio'>('transform');

  // Transform state
  const currentTransform: ClipTransform = clip.transform || {
    scale: 1.0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  };
  const [scale, setScale] = useState(currentTransform.scale);
  const [rotation, setRotation] = useState(currentTransform.rotation);
  const [flipH, setFlipH] = useState(currentTransform.flipHorizontal);
  const [flipV, setFlipV] = useState(currentTransform.flipVertical);

  // Color adjustments state
  const currentColors: ColorAdjustments = clip.colorAdjustments || {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    vignette: 0,
    warmth: 0,
  };
  const [brightness, setBrightness] = useState(currentColors.brightness);
  const [contrast, setContrast] = useState(currentColors.contrast);
  const [saturation, setSaturation] = useState(currentColors.saturation);
  const [exposure, setExposure] = useState(currentColors.exposure);
  const [vignette, setVignette] = useState(currentColors.vignette);
  const [warmth, setWarmth] = useState(currentColors.warmth);

  // Transitions
  const [transition, setTransition] = useState<TransitionType>(clip.transition || 'none');

  // Audio state
  const [volume, setVolume] = useState(clip.volume ?? 1.0);
  const [fadeInMs, setFadeInMs] = useState(clip.fadeInMs ?? 300);
  const [fadeOutMs, setFadeOutMs] = useState(clip.fadeOutMs ?? 300);

  const handleSave = () => {
    onUpdateClip({
      ...clip,
      volume,
      fadeInMs,
      fadeOutMs,
      transition,
      transform: {
        scale,
        rotation,
        flipHorizontal: flipH,
        flipVertical: flipV,
      },
      colorAdjustments: {
        brightness,
        contrast,
        saturation,
        exposure,
        vignette,
        warmth,
      },
    });
    onClose();
  };

  const rotateNext = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetColors = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setExposure(0);
    setVignette(0);
    setWarmth(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#12131a] border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-[#161822]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Clip Inspector</h3>
              <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">{clip.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-neutral-800 bg-[#0f1016] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('transform')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'transform' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Transform</span>
          </button>
          <button
            onClick={() => setActiveTab('color')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'color' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Grading</span>
          </button>
          <button
            onClick={() => setActiveTab('transition')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'transition' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Transition</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`py-3 flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'audio' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio Fade</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-neutral-200 text-xs">
          
          {/* 1. TRANSFORM TAB */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span>Scale / Zoom</span>
                  <span className="font-mono text-cyan-400">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-neutral-400 block mb-2">Rotate & Flip</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={rotateNext}
                    className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/60 flex flex-col items-center gap-1 text-neutral-200 cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-4 h-4 text-cyan-400" />
                    <span>{rotation}° Turn</span>
                  </button>
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      flipH ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-200'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip H</span>
                  </button>
                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                      flipV ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-200'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip V</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
                💡 <strong className="text-neutral-200">Pro-Tip:</strong> Zooming in 1.1x to 1.25x removes letterboxing on vertical 9:16 mobile feeds.
              </div>
            </div>
          )}

          {/* 2. COLOR GRADING TAB */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Precision Adjustments</span>
                <button
                  onClick={resetColors}
                  className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset all to 0
                </button>
              </div>

              {/* Sliders */}
              {[
                { label: 'Brightness', val: brightness, set: setBrightness, min: -100, max: 100 },
                { label: 'Contrast', val: contrast, set: setContrast, min: -100, max: 100 },
                { label: 'Saturation', val: saturation, set: setSaturation, min: -100, max: 100 },
                { label: 'Exposure', val: exposure, set: setExposure, min: -100, max: 100 },
                { label: 'Warmth', val: warmth, set: setWarmth, min: -100, max: 100 },
                { label: 'Vignette', val: vignette, set: setVignette, min: 0, max: 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono text-cyan-400">{item.val > 0 ? `+${item.val}` : item.val}</span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={item.val}
                    onChange={(e) => item.set(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 3. TRANSITION TAB */}
          {activeTab === 'transition' && (
            <div className="space-y-3">
              <span className="text-[11px] text-neutral-400 block mb-2">Select In/Out Transition</span>
              {/* Transition Selection Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'none', label: 'Cut (None)', desc: 'Standard instant cut' },
                  { id: 'flash', label: '⚡ White Flash', desc: 'Trending TikTok white pulse' },
                  { id: 'zoom_in', label: 'Punch Zoom', desc: 'High energy focal zoom + whoosh' },
                  { id: 'fade', label: 'Cross Dissolve', desc: 'Smooth brightness blend' },
                  { id: 'slide_left', label: 'Swipe Left', desc: 'Dynamic dynamic push' },
                  { id: 'glitch', label: 'RGB Glitch', desc: 'Cyberpunk scanline glitch' },
                  { id: 'wipe', label: 'Wipe Clean', desc: 'Horizontal scene peel' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTransition(t.id as TransitionType);
                      bgAudioEngine.playTransitionSfx(t.id);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      transition === t.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : 'bg-neutral-800/60 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{t.label}</span>
                      {transition === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. AUDIO FADE TAB */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span>Clip Volume</span>
                  <span className="font-mono text-cyan-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span>Fade-In Ramp</span>
                  <span className="font-mono text-cyan-400">{fadeInMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={fadeInMs}
                  onChange={(e) => setFadeInMs(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span>Fade-Out Ramp</span>
                  <span className="font-mono text-cyan-400">{fadeOutMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={fadeOutMs}
                  onChange={(e) => setFadeOutMs(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-[#14151e] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Clip</span>
          </button>
        </div>

      </div>
    </div>
  );
};
