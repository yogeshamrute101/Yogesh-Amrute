import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, RotateCcw, ShieldAlert, Sparkles, Volume2, VolumeX, Sliders } from 'lucide-react';
import { AspectRatio, CaptionItem, FilterType, StickerItem, TimelineClip } from '../types';
import { bgAudioEngine } from '../utils/audioSynth';

interface VideoCanvasPlayerProps {
  clips: TimelineClip[];
  captions: CaptionItem[];
  stickers?: StickerItem[];
  currentPlayheadMs: number;
  totalDurationMs: number;
  aspectRatio: AspectRatio;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (ms: number) => void;
  onOpenClipInspector?: () => void;
}

export interface VideoCanvasPlayerRef {
  getCanvasElement: () => HTMLCanvasElement | null;
}

export const VideoCanvasPlayer = forwardRef<VideoCanvasPlayerRef, VideoCanvasPlayerProps>(({
  clips,
  captions,
  stickers = [],
  currentPlayheadMs,
  totalDurationMs,
  aspectRatio,
  isPlaying,
  onPlayPause,
  onSeek,
  onOpenClipInspector,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const lastTransitionClipIndexRef = useRef<number>(-1);

  useImperativeHandle(ref, () => ({
    getCanvasElement: () => canvasRef.current,
  }));

  // Determine current active clip based on playhead
  let accumulatedMs = 0;
  let targetIndex = 0;
  let clipLocalMs = 0;
  let timeInClipTimelineMs = 0;

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const clipDuration = (clip.endTrimMs - clip.startTrimMs) / clip.speed;
    if (currentPlayheadMs < accumulatedMs + clipDuration || i === clips.length - 1) {
      targetIndex = i;
      timeInClipTimelineMs = Math.max(0, currentPlayheadMs - accumulatedMs);
      clipLocalMs = timeInClipTimelineMs * clip.speed + clip.startTrimMs;
      break;
    }
    accumulatedMs += clipDuration;
  }

  const activeClip = clips[targetIndex] || null;

  // Trigger audio SFX on transition cut
  useEffect(() => {
    if (!isPlaying) return;
    if (targetIndex > 0 && targetIndex !== lastTransitionClipIndexRef.current) {
      lastTransitionClipIndexRef.current = targetIndex;
      if (activeClip?.transition && activeClip.transition !== 'none' && activeClip.transition !== 'cut') {
        bgAudioEngine.playTransitionSfx(activeClip.transition);
      }
    }
  }, [targetIndex, isPlaying, activeClip?.transition]);

  // Sync video source
  useEffect(() => {
    if (!videoRef.current || !activeClip) return;
    if (videoRef.current.src !== activeClip.videoUrl) {
      setVideoLoaded(false);
      videoRef.current.src = activeClip.videoUrl;
      videoRef.current.load();
    }
    setActiveClipIndex(targetIndex);
  }, [activeClip?.videoUrl, targetIndex]);

  // Sync video time
  useEffect(() => {
    if (!videoRef.current || !activeClip || !videoLoaded) return;
    const targetSeconds = clipLocalMs / 1000;
    if (Math.abs(videoRef.current.currentTime - targetSeconds) > 0.25) {
      videoRef.current.currentTime = targetSeconds;
    }
  }, [clipLocalMs, videoLoaded]);

  // Play / Pause video element
  useEffect(() => {
    if (!videoRef.current || !videoLoaded) return;
    if (isPlaying) {
      videoRef.current.playbackRate = activeClip?.speed || 1.0;
      videoRef.current.muted = activeClip?.isMuted || false;
      videoRef.current.volume = activeClip?.volume ?? 1.0;
      videoRef.current.play().catch(() => {
        // Autoplay policy or format fallback handled in canvas
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, videoLoaded, activeClip?.speed, activeClip?.isMuted, activeClip?.volume]);

  // Real-time Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Check active transition
      const isTransitioning =
        targetIndex > 0 &&
        timeInClipTimelineMs < 450 &&
        activeClip?.transition &&
        activeClip.transition !== 'cut' &&
        activeClip.transition !== 'none';
      const transProgress = isTransitioning ? Math.min(1, Math.max(0, timeInClipTimelineMs / 450)) : 1;

      // 1. Render Video Frame or Animated Fallback
      const video = videoRef.current;
      const hasValidVideoFrame = video && videoLoaded && video.readyState >= 2;

      ctx.save();

      // Apply transition motion effects (zoom_in, slide, fade, glitch)
      if (isTransitioning) {
        if (activeClip.transition === 'zoom_in') {
          const zScale = 1 + (1 - transProgress) * 0.25;
          ctx.translate(width / 2, height / 2);
          ctx.scale(zScale, zScale);
          ctx.translate(-width / 2, -height / 2);
        } else if (activeClip.transition === 'fade' || activeClip.transition === 'dissolve') {
          ctx.globalAlpha = transProgress;
        } else if (activeClip.transition === 'slide_left') {
          const slideOffset = (1 - transProgress) * width;
          ctx.translate(slideOffset, 0);
        } else if (activeClip.transition === 'glitch') {
          const shift = (Math.random() - 0.5) * 28 * (1 - transProgress);
          ctx.translate(shift, 0);
        } else if (activeClip.transition === 'wipe') {
          ctx.beginPath();
          ctx.rect(0, 0, width * transProgress, height);
          ctx.clip();
        }
      }

      if (hasValidVideoFrame && video) {
        // Letterbox / Fit aspect ratio math
        const videoRatio = (video.videoWidth || 16) / (video.videoHeight || 9);
        const canvasRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        // Cover mode for vertical reels, fit for landscape
        if (aspectRatio === '9:16') {
          if (videoRatio > canvasRatio) {
            drawHeight = height;
            drawWidth = height * videoRatio;
            offsetX = (width - drawWidth) / 2;
          } else {
            drawWidth = width;
            drawHeight = width / videoRatio;
            offsetY = (height - drawHeight) / 2;
          }
        } else {
          if (videoRatio > canvasRatio) {
            drawWidth = width;
            drawHeight = width / videoRatio;
            offsetY = (height - drawHeight) / 2;
          } else {
            drawHeight = height;
            drawWidth = height * videoRatio;
            offsetX = (width - drawWidth) / 2;
          }
        }

        // Apply visual color filters & transforms
        const transform = activeClip?.transform || { scale: 1, rotation: 0, flipHorizontal: false, flipVertical: false };
        const cx = width / 2;
        const cy = height / 2;
        ctx.translate(cx, cy);
        if (transform.rotation) {
          ctx.rotate((transform.rotation * Math.PI) / 180);
        }
        ctx.scale(
          (transform.flipHorizontal ? -1 : 1) * (transform.scale || 1),
          (transform.flipVertical ? -1 : 1) * (transform.scale || 1)
        );
        ctx.translate(-cx, -cy);

        applyCanvasFilter(ctx, activeClip?.filter || 'none', activeClip?.colorAdjustments);
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        // High-aesthetic procedural studio fallback preview
        renderProceduralVisuals(ctx, width, height, currentPlayheadMs, activeClip);
      }

      ctx.restore();

      // White flash transition overlay
      if (isTransitioning && activeClip?.transition === 'flash') {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${(1 - transProgress) * 0.88})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Glitch scanline bars overlay
      if (isTransitioning && activeClip?.transition === 'glitch') {
        ctx.save();
        const glitchLines = 3;
        for (let g = 0; g < glitchLines; g++) {
          const gy = Math.random() * height;
          const gh = 4 + Math.random() * 12;
          ctx.fillStyle = g % 2 === 0 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 0, 100, 0.45)';
          ctx.fillRect(0, gy, width, gh);
        }
        ctx.restore();
      }

      // 2. Filter Overlays & Post-Processing (Vignette, Film Grain, Cyberpunk Glow, Warmth)
      renderFilterPostFX(ctx, activeClip?.filter || 'none', activeClip?.colorAdjustments, width, height);

      // 3. Stickers Layer
      renderStickersLayer(ctx, stickers, currentPlayheadMs, width, height);

      // 4. Subtitles / Captions Layer
      renderCaptionsLayer(ctx, captions, currentPlayheadMs, width, height);

      // 5. Social Media Safe Zones (TikTok / Reels safe areas)
      if (showSafeZones && aspectRatio === '9:16') {
        renderSocialSafeZones(ctx, width, height);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [videoLoaded, activeClip, currentPlayheadMs, captions, stickers, showSafeZones, aspectRatio]);

  // Dimension sizing based on aspect ratio
  const getCanvasDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 540, height: 960 };
      case '1:1':
        return { width: 720, height: 720 };
      case '16:9':
        return { width: 960, height: 540 };
      case '4:5':
        return { width: 640, height: 800 };
      default:
        return { width: 540, height: 960 };
    }
  };

  const dims = getCanvasDimensions();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none overflow-hidden bg-[#090a0f]">
      {/* Hidden processing video element */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        crossOrigin="anonymous"
        onLoadedData={() => setVideoLoaded(true)}
        onError={() => setVideoLoaded(false)}
      />

      {/* Main Video Viewport Canvas */}
      <div className="relative max-w-full max-h-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden border border-neutral-800">
        <canvas
          ref={canvasRef}
          width={dims.width}
          height={dims.height}
          className="max-h-[50vh] sm:max-h-[54vh] w-auto aspect-auto rounded-xl object-contain bg-black cursor-pointer"
          onClick={onPlayPause}
        />

        {/* Center Play Overlay Icon when paused */}
        {!isPlaying && (
          <button
            onClick={onPlayPause}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform active:scale-95 cursor-pointer z-20 backdrop-blur-xs"
            aria-label="Play video"
          >
            <Play className="w-6 h-6 fill-black ml-1" />
          </button>
        )}

        {/* Top Video Overlay Controls (Aspect & Safe Zone toggle) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white shadow-sm">
            <span className="text-cyan-400 font-bold">{aspectRatio}</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-300 capitalize">{activeClip?.filter.replace('_', ' ') || 'Normal'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenClipInspector && (
              <button
                onClick={onOpenClipInspector}
                className="px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border border-cyan-500/40 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
                title="Crop, Rotate, Color Adjustments & Transitions"
              >
                <Sliders className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            )}

            {aspectRatio === '9:16' && (
              <button
                onClick={() => setShowSafeZones(!showSafeZones)}
                className={`px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border transition-all cursor-pointer flex items-center gap-1 ${
                  showSafeZones
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                    : 'bg-black/60 text-neutral-300 border-white/10 hover:text-white'
                }`}
                title="Toggle TikTok / Instagram Reels UI Safe Zones"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Safe Zones</span>
              </button>
            )}

            <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300">
              {formatTimecode(currentPlayheadMs)}
            </div>
          </div>
        </div>

        {/* Active Clip Title Indicator & Audio Waveform */}
        {activeClip && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-neutral-200 pointer-events-none flex items-center gap-2 z-20 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="truncate max-w-[150px] font-medium">{activeClip.name}</span>
            <span className="text-neutral-400 text-[10px]">{activeClip.speed}x</span>

            {/* Live Audio Equalizer Bars */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-2.5 ml-1">
                <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse h-2"></span>
                <span className="w-0.5 bg-cyan-300 rounded-full animate-bounce h-2.5"></span>
                <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse h-1.5"></span>
              </div>
            )}

            {/* Transition Badge */}
            {activeClip.transition && activeClip.transition !== 'none' && activeClip.transition !== 'cut' && (
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono uppercase font-bold border border-cyan-500/30">
                {activeClip.transition.replace('_', ' ')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// Helper: Filter Canvas Adjustments + Custom Color Grading
function applyCanvasFilter(
  ctx: CanvasRenderingContext2D,
  filter: FilterType,
  colorAdjustments?: any
) {
  const b = 100 + (colorAdjustments?.brightness || 0);
  const c = 100 + (colorAdjustments?.contrast || 0);
  const s = 100 + (colorAdjustments?.saturation || 0);

  let baseFilter = '';
  switch (filter) {
    case 'cinematic':
      baseFilter = 'contrast(120%) saturate(95%) brightness(95%)';
      break;
    case 'cyberpunk':
      baseFilter = 'contrast(130%) saturate(150%) hue-rotate(15deg)';
      break;
    case 'warm_vintage':
      baseFilter = 'sepia(30%) contrast(115%) brightness(98%)';
      break;
    case 'noir':
      baseFilter = 'grayscale(100%) contrast(145%) brightness(90%)';
      break;
    case 'vibrant':
      baseFilter = 'saturate(140%) contrast(110%) brightness(102%)';
      break;
    case 'golden_hour':
      baseFilter = 'sepia(20%) saturate(130%) brightness(105%) hue-rotate(-10deg)';
      break;
    default:
      baseFilter = 'none';
  }

  const customFilter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  ctx.filter = baseFilter === 'none' ? customFilter : `${baseFilter} ${customFilter}`;
}

// Helper: Additional filter post-fx (Vignette, Warmth Tint, Cyberpunk Glow)
function renderFilterPostFX(
  ctx: CanvasRenderingContext2D,
  filter: FilterType,
  colorAdjustments: any,
  w: number,
  h: number
) {
  ctx.save();
  const vignetteVal = colorAdjustments?.vignette || (filter === 'cinematic' ? 35 : filter === 'noir' ? 55 : 0);
  if (vignetteVal > 0) {
    const intensity = Math.min(0.85, vignetteVal / 100);
    const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.75);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }

  // Warmth overlay
  const warmth = colorAdjustments?.warmth || 0;
  if (warmth !== 0) {
    if (warmth > 0) {
      ctx.fillStyle = `rgba(255, 140, 0, ${Math.min(0.25, warmth / 350)})`;
    } else {
      ctx.fillStyle = `rgba(0, 160, 255, ${Math.min(0.25, Math.abs(warmth) / 350)})`;
    }
    ctx.fillRect(0, 0, w, h);
  }

  if (filter === 'cyberpunk') {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(255, 42, 133, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

// Helper: Render Animated Stickers Layer
function renderStickersLayer(
  ctx: CanvasRenderingContext2D,
  stickers: StickerItem[],
  currentMs: number,
  w: number,
  h: number
) {
  if (!stickers || stickers.length === 0) return;

  const activeStickers = stickers.filter(
    (s) => currentMs >= s.startMs && currentMs <= s.endMs
  );

  for (const s of activeStickers) {
    ctx.save();
    const posX = (s.x / 100) * w;
    const posY = (s.y / 100) * h;

    // Animation computation
    const progress = Math.min(1, (currentMs - s.startMs) / 300);
    let scaleModifier = s.scale;
    if (s.animation === 'pop') {
      scaleModifier *= Math.min(1.2, 0.5 + progress * 0.7);
    } else if (s.animation === 'pulse') {
      const pulseT = ((currentMs - s.startMs) % 800) / 800;
      scaleModifier *= 1 + Math.sin(pulseT * Math.PI * 2) * 0.1;
    }

    ctx.translate(posX, posY);
    if (s.rotation) ctx.rotate((s.rotation * Math.PI) / 180);
    ctx.scale(scaleModifier, scaleModifier);

    // Is badge or emoji?
    if (s.content.length > 2 && !s.content.startsWith('🔥') && !s.content.startsWith('🚨')) {
      // General text badge
      ctx.font = `bold ${Math.round(w * 0.045)}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillRect(-w * 0.2, -h * 0.03, w * 0.4, h * 0.06);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(s.content, 0, 0);
    } else {
      // Viral Badge with high-retention pill
      ctx.font = `900 ${Math.round(w * 0.048)}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Background rounded pill
      const textMetrics = ctx.measureText(s.content);
      const pillW = textMetrics.width + 24;
      const pillH = Math.round(w * 0.08);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(-pillW / 2, -pillH / 2, pillW, pillH, 12);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFD700';
      ctx.stroke();

      // Golden text
      ctx.fillStyle = '#FFEE55';
      ctx.fillText(s.content, 0, 0);
    }

    ctx.restore();
  }
}

// Helper: Procedural Visuals if video is buffering or offline
function renderProceduralVisuals(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeMs: number,
  clip: TimelineClip | null
) {
  const t = timeMs / 1000;
  // Modern aesthetic generative background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  const hue1 = (t * 20 + (clip?.id.length || 1) * 30) % 360;
  const hue2 = (hue1 + 90) % 360;

  grad.addColorStop(0, `hsl(${hue1}, 70%, 15%)`);
  grad.addColorStop(1, `hsl(${hue2}, 80%, 8%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Animated ambient orbs
  ctx.save();
  const orbX = w / 2 + Math.sin(t * 1.5) * (w * 0.25);
  const orbY = h / 2 + Math.cos(t * 1.2) * (h * 0.2);
  const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, w * 0.4);
  orbGrad.addColorStop(0, `hsla(${hue1}, 90%, 55%, 0.4)`);
  orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(orbX, orbY, w * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Grid mesh lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Visual label badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(clip?.name || 'Studio Sequence', w / 2, h / 2);

  ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText(`Real-Time Engine • ${clip?.filter.toUpperCase() || 'NORMAL'}`, w / 2, h / 2 + 28);
  ctx.restore();
}

// Helper: Subtitle / Captions Layer
function renderCaptionsLayer(
  ctx: CanvasRenderingContext2D,
  captions: CaptionItem[],
  currentMs: number,
  w: number,
  h: number
) {
  // Find current active caption
  const activeCaption = captions.find(
    (c) => currentMs >= c.startMs && currentMs <= c.endMs
  );

  if (!activeCaption || !activeCaption.text) return;

  ctx.save();
  const text = activeCaption.text;
  const style = activeCaption.style;

  // Calculate Y position
  let posY = h * 0.78; // default bottom safe area
  if (activeCaption.position === 'center') posY = h * 0.5;
  if (activeCaption.position === 'top') posY = h * 0.22;

  // Text formatting
  const words = text.split(/\s+/).filter(Boolean);
  const capDuration = Math.max(1, activeCaption.endMs - activeCaption.startMs);
  const progress = Math.max(0, Math.min(0.999, (currentMs - activeCaption.startMs) / capDuration));
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  if (style === 'yellow_viral') {
    // MrBeast / TikTok viral yellow style with dynamic karaoke word bounce
    const fontSize = Math.round(w * 0.062);
    ctx.font = `800 ${fontSize}px "Outfit", sans-serif`;
    ctx.textBaseline = 'middle';

    const spaceWidth = ctx.measureText(' ').width;
    const wordWidths = words.map((wd) => ctx.measureText(wd.toUpperCase()).width);
    const totalLineWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * spaceWidth;

    let currentX = (w - totalLineWidth) / 2;

    words.forEach((word, idx) => {
      const uWord = word.toUpperCase();
      const isActive = idx === activeWordIdx || (activeCaption.highlightWord && uWord.includes(activeCaption.highlightWord.toUpperCase()));
      const wordW = wordWidths[idx];

      ctx.save();
      if (isActive) {
        // Active word bounce & glow
        ctx.translate(currentX + wordW / 2, posY);
        ctx.scale(1.14, 1.14);
        ctx.translate(-(currentX + wordW / 2), -posY);

        // High contrast yellow pill background for active keyword
        const pillPad = 6;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        roundRect(ctx, currentX - pillPad, posY - fontSize * 0.6, wordW + pillPad * 2, fontSize * 1.2, 6);
        ctx.fill();

        ctx.lineWidth = 7;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(uWord, currentX, posY);

        ctx.fillStyle = '#FFE600';
        ctx.fillText(uWord, currentX, posY);
      } else {
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(uWord, currentX, posY);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(uWord, currentX, posY);
      }
      ctx.restore();

      currentX += wordW + spaceWidth;
    });
  } else if (style === 'neon_cyber') {
    // Cyberpunk Glow Box
    ctx.font = `700 ${Math.round(w * 0.052)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(text).width;
    const padding = 16;
    const boxH = Math.round(w * 0.09);

    // Rounded background box
    ctx.fillStyle = 'rgba(10, 10, 20, 0.85)';
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    roundRect(ctx, w / 2 - textWidth / 2 - padding, posY - boxH / 2, textWidth + padding * 2, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, w / 2, posY);
  } else if (style === 'minimal_dark') {
    // Minimalist Clean Box
    ctx.font = `600 ${Math.round(w * 0.048)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(text).width;
    const padding = 14;
    const boxH = Math.round(w * 0.08);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    roundRect(ctx, w / 2 - textWidth / 2 - padding, posY - boxH / 2, textWidth + padding * 2, boxH, 6);
    ctx.fill();

    ctx.fillStyle = '#F3F4F6';
    ctx.fillText(text, w / 2, posY);
  } else {
    // Clean modern pop
    ctx.font = `700 ${Math.round(w * 0.058)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(text, w / 2, posY);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, w / 2, posY);
  }

  ctx.restore();
}

// Helper: Render TikTok / Reels Safe Zones
function renderSocialSafeZones(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);

  // Top header zone (search & following)
  ctx.strokeRect(0, 0, w, h * 0.12);
  ctx.fillRect(0, 0, w, h * 0.12);

  // Bottom caption & audio ticker zone
  ctx.strokeRect(0, h * 0.82, w, h * 0.18);
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  // Right action icons zone (like, comment, bookmark, share)
  const rightW = w * 0.2;
  ctx.strokeRect(w - rightW, h * 0.35, rightW, h * 0.45);
  ctx.fillRect(w - rightW, h * 0.35, rightW, h * 0.45);

  // Labels
  ctx.setLineDash([]);
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TOP BAR ZONE', w / 2, h * 0.06);
  ctx.fillText('BOTTOM CAPTION & SOUND ZONE', w / 2, h * 0.91);
  ctx.fillText('RIGHT ICONS', w - rightW / 2, h * 0.58);

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function formatTimecode(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}
