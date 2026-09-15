import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Film,
  Hash,
  Clock,
  ThumbsUp,
  AlertCircle,
  Sliders,
  XCircle,
  Play
} from 'lucide-react';
import { AspectRatio, ExportSettings, ProjectTimeline, SocialPackageResponse } from '../types';
import { exportCanvasVideoAdvanced, ExportProgress, ExportHandle } from '../utils/videoExporter';
import { bgAudioEngine } from '../utils/audioSynth';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: ProjectTimeline;
  canvasElement: HTMLCanvasElement | null;
  totalDurationMs: number;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  timeline,
  canvasElement,
  totalDurationMs,
}) => {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'instagram' | 'youtube' | 'x'>('tiktok');
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    aspectRatio: timeline.aspectRatio,
    resolution: '1080p',
    fps: 30,
    quality: 'high',
  });

  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    stage: 'initializing',
    progressPercent: 0,
    message: 'Ready to render',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [socialData, setSocialData] = useState<SocialPackageResponse | null>(null);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const exportHandleRef = useRef<ExportHandle | null>(null);

  // Fetch AI Social Media Package on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    async function loadSocialPackage() {
      setLoadingSocial(true);
      try {
        const res = await fetch('/api/ai/social-package', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: timeline.name || 'Viral Video',
            description: `A ${Math.round(totalDurationMs / 1000)}s ${timeline.aspectRatio} video created with VIDOAI Studio`,
          }),
        });
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setSocialData(json.data);
        }
      } catch (err) {
        console.error('Failed to load social package:', err);
      } finally {
        if (isMounted) setLoadingSocial(false);
      }
    }
    loadSocialPackage();
    return () => {
      isMounted = false;
    };
  }, [isOpen, timeline.name, timeline.aspectRatio, totalDurationMs]);

  if (!isOpen) return null;

  // Start Advanced Canvas Video Export
  const handleStartExport = async () => {
    if (!canvasElement) return;

    setIsExporting(true);
    setExportedBlob(null);
    setExportedUrl(null);

    try {
      const audioDest = bgAudioEngine.getAudioStreamDestination();
      const clipDuration = Math.min(totalDurationMs, 20000); // 20s max for real-time mobile encoder demo

      const handle = exportCanvasVideoAdvanced(
        canvasElement,
        audioDest,
        clipDuration,
        exportSettings,
        (prog) => {
          setExportProgress(prog);
        }
      );

      exportHandleRef.current = handle;
      const blob = await handle.promise;
      const url = URL.createObjectURL(blob);
      setExportedBlob(blob);
      setExportedUrl(url);
    } catch (err: any) {
      if (err.message !== 'Export was cancelled.') {
        console.error('Export failed:', err);
      }
    } finally {
      setIsExporting(false);
      exportHandleRef.current = null;
    }
  };

  const handleCancelExport = () => {
    if (exportHandleRef.current) {
      exportHandleRef.current.cancel();
      setIsExporting(false);
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    const shareTitle = socialData?.tiktok.caption || timeline.name;
    const shareText = `${shareTitle}\n\n#VIDOAI #VideoCreator`;

    if (navigator.share) {
      try {
        if (exportedBlob) {
          const file = new File(
            [exportedBlob],
            `${timeline.name.toLowerCase().replace(/\s+/g, '_')}_${exportSettings.resolution}.mp4`,
            { type: exportedBlob.type }
          );

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: timeline.name,
              text: shareText,
            });
            return;
          }
        }

        await navigator.share({
          title: timeline.name,
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {
        console.warn('Share cancelled:', e);
      }
    } else {
      handleDownloadVideo();
    }
  };

  const handleDownloadVideo = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    a.download = `${timeline.name.toLowerCase().replace(/\s+/g, '_')}_${exportSettings.resolution}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#12131a] rounded-t-3xl sm:rounded-2xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#161822]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-md shadow-cyan-500/20">
              <Share2 className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>VIDOAI Production Export Studio</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  {timeline.aspectRatio}
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Master rendering, bitrate profile & social kits</p>
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-neutral-200 text-xs">
          
          {/* Export Settings Panel */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Encoder Specification</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {exportSettings.resolution.toUpperCase()} • {exportSettings.fps} FPS • {exportSettings.quality.toUpperCase()}
              </span>
            </div>

            {/* Resolution Buttons */}
            <div>
              <span className="text-[10px] text-neutral-400 block mb-1.5">Resolution</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '720p', label: '720p (HD)', desc: 'Fast render' },
                  { id: '1080p', label: '1080p (FHD)', desc: 'Recommended' },
                  { id: '4k', label: '4K (UHD)', desc: 'Studio grade' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setExportSettings((prev) => ({ ...prev, resolution: r.id as any }))}
                    disabled={isExporting}
                    className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                      exportSettings.resolution === r.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">{r.label}</div>
                    <div className="text-[9px] text-neutral-400">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Framerate & Bitrate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-neutral-400 block mb-1.5">Framerate (FPS)</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[24, 30, 60].map((f) => (
                    <button
                      key={f}
                      onClick={() => setExportSettings((prev) => ({ ...prev, fps: f as any }))}
                      disabled={isExporting}
                      className={`py-1.5 rounded-lg border text-center text-xs font-mono cursor-pointer transition-colors ${
                        exportSettings.fps === f
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 block mb-1.5">Bitrate Quality</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['standard', 'high', 'ultra'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setExportSettings((prev) => ({ ...prev, quality: q as any }))}
                      disabled={isExporting}
                      className={`py-1.5 rounded-lg border text-center text-[10px] capitalize cursor-pointer transition-colors ${
                        exportSettings.quality === q
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render Progress or Trigger Button */}
            {isExporting ? (
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-medium animate-pulse">{exportProgress.message}</span>
                  <span className="font-mono font-bold text-white">{exportProgress.progressPercent}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-200"
                    style={{ width: `${exportProgress.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCancelExport}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Export</span>
                  </button>
                </div>
              </div>
            ) : exportedBlob ? (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-300 text-xs">Video Master Rendered</span>
                  <p className="text-[10px] text-neutral-400">
                    {(exportedBlob.size / (1024 * 1024)).toFixed(1)} MB • {exportSettings.resolution} • {exportSettings.fps} FPS
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadVideo}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleNativeShare}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartExport}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Film className="w-4 h-4" />
                <span>Start Video Render</span>
              </button>
            )}
          </div>

          {/* AI Viral Social Posting Kit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>AI Social Media Package</span>
              </span>
              {socialData && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                  Viral Score {socialData.viralScore}/100
                </span>
              )}
            </div>

            {/* Platform Selector */}
            <div className="grid grid-cols-4 gap-2 border-b border-neutral-800 pb-2">
              {[
                { id: 'tiktok', label: 'TikTok', color: 'text-cyan-400' },
                { id: 'instagram', label: 'Reels', color: 'text-pink-400' },
                { id: 'youtube', label: 'Shorts', color: 'text-red-400' },
                { id: 'x', label: 'X / Twitter', color: 'text-blue-400' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id as any)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs cursor-pointer transition-colors ${
                    activeTab === p.id
                      ? 'bg-neutral-800 border-neutral-600 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className={p.color}>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Platform Content */}
            {socialData && (
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                {activeTab === 'tiktok' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Caption & Trending Sound</span>
                      <button
                        onClick={() => copyToClipboard(socialData.tiktok.caption + '\n\n' + socialData.tiktok.hashtags.join(' '), 'tt')}
                        className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'tt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All</span>
                      </button>
                    </div>
                    <p className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-white font-medium text-xs leading-relaxed">
                      {socialData.tiktok.caption}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {socialData.tiktok.hashtags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-cyan-300 font-mono text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instagram' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Carousel Caption & Engagement</span>
                      <button
                        onClick={() => copyToClipboard(socialData.instagram.caption + '\n\n' + socialData.instagram.hashtags.join(' '), 'ig')}
                        className="text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'ig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All</span>
                      </button>
                    </div>
                    <p className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-white font-medium text-xs leading-relaxed whitespace-pre-line">
                      {socialData.instagram.caption}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {socialData.instagram.hashtags.slice(0, 8).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-pink-300 font-mono text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'youtube' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Shorts Title & SEO Tags</span>
                      <button
                        onClick={() => copyToClipboard(socialData.youtubeShorts.title + '\n\n' + socialData.youtubeShorts.description, 'yt')}
                        className="text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'yt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-white font-bold text-xs">
                      {socialData.youtubeShorts.title}
                    </div>
                    <p className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-neutral-300 text-[11px] leading-relaxed">
                      {socialData.youtubeShorts.description}
                    </p>
                  </div>
                )}

                {activeTab === 'x' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Thread Hook Post</span>
                      <button
                        onClick={() => copyToClipboard(socialData.xTwitter.tweet + '\n\n' + socialData.xTwitter.hashtags.join(' '), 'x')}
                        className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'x' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All</span>
                      </button>
                    </div>
                    <p className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 text-white font-medium text-xs leading-relaxed whitespace-pre-line">
                      {socialData.xTwitter.tweet}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#14151e] flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            {exportedBlob ? '✅ File prepared for device sharing' : 'Configure settings and start render'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
