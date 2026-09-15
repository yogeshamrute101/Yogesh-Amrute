import React, { useRef, useState } from 'react';
import { Plus, Upload, Video, Camera, Check, Film, Library } from 'lucide-react';
import { STOCK_LIBRARY_CLIPS } from '../data/sampleClips';
import { TimelineClip } from '../types';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClipToTimeline: (clip: TimelineClip) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddClipToTimeline,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload' | 'camera'>('stock');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedStream, setRecordedStream] = useState<MediaStream | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Add stock clip
  const handleSelectStockClip = (stock: typeof STOCK_LIBRARY_CLIPS[0]) => {
    const newClip: TimelineClip = {
      id: `clip_${Date.now()}`,
      name: stock.name,
      videoUrl: stock.url,
      thumbnail: stock.thumbnail,
      startTrimMs: 0,
      endTrimMs: stock.durationMs,
      originalDurationMs: stock.durationMs,
      speed: 1.0,
      volume: 1.0,
      isMuted: false,
      filter: stock.recommendedFilter,
      transition: 'cut',
      category: 'broll',
    };
    onAddClipToTimeline(newClip);
    onClose();
  };

  // Upload custom file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);

    const newClip: TimelineClip = {
      id: `clip_upload_${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      videoUrl: url,
      startTrimMs: 0,
      endTrimMs: 8000,
      originalDurationMs: 8000,
      speed: 1.0,
      volume: 1.0,
      isMuted: false,
      filter: 'none',
      transition: 'cut',
      category: 'uploaded',
    };

    onAddClipToTimeline(newClip);
    onClose();
  };

  // Start Camera Recording
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: true,
      });
      setRecordedStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied or failed:', err);
    }
  };

  const handleStartRecord = () => {
    if (!recordedStream) return;
    recordedChunksRef.current = [];
    const rec = new MediaRecorder(recordedStream);
    mediaRecorderRef.current = rec;

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    rec.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const newClip: TimelineClip = {
        id: `clip_rec_${Date.now()}`,
        name: `Camera Take ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        videoUrl: url,
        startTrimMs: 0,
        endTrimMs: recordingSeconds * 1000,
        originalDurationMs: recordingSeconds * 1000,
        speed: 1.0,
        volume: 1.0,
        isMuted: false,
        filter: 'vibrant',
        transition: 'cut',
        category: 'recorded',
      };
      stopCamera();
      onAddClipToTimeline(newClip);
      onClose();
    };

    rec.start();
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const stopCamera = () => {
    if (recordedStream) {
      recordedStream.getTracks().forEach((t) => t.stop());
      setRecordedStream(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141624] rounded-t-3xl sm:rounded-2xl border border-neutral-700/80 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#191c2d]">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Media Library & Camera</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stock')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'stock' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Stock Clips
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Upload Video
          </button>
          <button
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'camera' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Record Camera
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Stock Clips */}
          {activeTab === 'stock' && (
            <div className="grid grid-cols-2 gap-3">
              {STOCK_LIBRARY_CLIPS.map((stock) => (
                <div
                  key={stock.id}
                  onClick={() => handleSelectStockClip(stock)}
                  className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-cyan-500 cursor-pointer transition-all group relative"
                >
                  <div
                    className="h-24 bg-cover bg-center group-hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url(${stock.thumbnail})` }}
                  ></div>
                  <div className="p-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block truncate">{stock.name}</span>
                      <span className="text-[10px] text-neutral-400">{stock.durationMs / 1000}s • {stock.category}</span>
                    </div>
                    <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Video */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-700 rounded-2xl bg-neutral-900/40 text-center space-y-3">
              <Upload className="w-8 h-8 text-neutral-400" />
              <div>
                <span className="text-xs font-bold text-white block">Drop video file here or browse</span>
                <span className="text-[10px] text-neutral-400">Supports MP4, WebM, QuickTime (.mov)</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
              >
                Choose Video File
              </button>
            </div>
          )}

          {/* Record Camera */}
          {activeTab === 'camera' && (
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-neutral-800">
                <video ref={videoPreviewRef} playsInline muted className="w-full h-full object-cover" />
                {isRecording && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white font-mono text-xs flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>REC 00:{String(recordingSeconds).padStart(2, '0')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecord}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                    <span>Start Recording Take</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecord}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span className="w-2.5 h-2.5 bg-black rounded-xs"></span>
                    <span>Stop & Add to Timeline</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
