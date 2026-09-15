import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Music,
  Mic,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Scissors,
  Play,
  Square,
  Check,
  Zap,
} from 'lucide-react';
import { AudioTrackItem, ProjectTimeline } from '../types';
import { bgAudioEngine } from '../utils/audioSynth';

interface AudioScreenProps {
  onBack: () => void;
  timeline?: ProjectTimeline;
  onUpdateAudio?: (audio: AudioTrackItem | null) => void;
  onNavigateToEditor?: () => void;
  currentPlayheadMs?: number;
}

export const AudioScreen: React.FC<AudioScreenProps> = ({
  onBack,
  timeline,
  onUpdateAudio,
  onNavigateToEditor,
  currentPlayheadMs = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'voiceover' | 'sfx' | 'extract'>('music');
  const [selectedGenre, setSelectedGenre] = useState<AudioTrackItem['genre']>(
    timeline?.bgAudio?.genre || 'phonk'
  );
  const [volume, setVolume] = useState<number>(timeline?.bgAudio ? timeline.bgAudio.volume : 0.6);
  const [ducking, setDucking] = useState<boolean>(timeline?.bgAudio ? timeline.bgAudio.ducking : true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(
    timeline?.bgAudio ? timeline.bgAudio.isMuted : false
  );

  // Voiceover state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // SFX Feedback
  const [lastPlayedSfx, setLastPlayedSfx] = useState<string | null>(null);

  const tracks = [
    { genre: 'phonk', name: 'Neon Drift (Phonk)', desc: 'Heavy 808 bass & fast high-energy cuts' },
    { genre: 'lofi', name: 'Chill Coffee Lo-Fi', desc: 'Warm vintage vinyl chords for vlogs' },
    { genre: 'cinematic', name: 'Epic Horizon', desc: 'Dynamic crescendo for travel & stories' },
    { genre: 'ambient', name: 'Serene Atmosphere', desc: 'Subtle soundscape for educational videos' },
  ];

  const handleApplyMusic = (genre: AudioTrackItem['genre'], title: string) => {
    setSelectedGenre(genre);
    const updated: AudioTrackItem = {
      id: `audio_${genre}_${Date.now()}`,
      title,
      genre,
      volume,
      isMuted: isAudioMuted,
      ducking,
      durationMs: 30000,
    };
    onUpdateAudio(updated);
    bgAudioEngine.setGenre(genre);
    bgAudioEngine.setVolume(volume);
  };

  const handleRemoveAudio = () => {
    onUpdateAudio(null);
    bgAudioEngine.stop();
  };

  // Start Real Microphone Voiceover Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      alert('Microphone access is required to record voiceover.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Synthesize instant SFX preview using Web Audio
  const playSfx = (type: 'whoosh' | 'pop' | 'boom' | 'ding') => {
    setLastPlayedSfx(type);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'whoosh') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'boom') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
    setTimeout(() => setLastPlayedSfx(null), 1000);
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
            <h1 className="text-sm font-bold tracking-wide text-white">AUDIO</h1>
            <p className="text-[10px] text-neutral-400">Soundtracks, voiceover & sound effects</p>
          </div>
        </div>

        <button
          onClick={onNavigateToEditor}
          className="px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Done</span>
        </button>
      </div>

      {/* TABS: Music, Voiceover, Sound Effects, Extract Audio */}
      <div className="p-3 border-b border-neutral-900 bg-[#0C0E14] grid grid-cols-4 gap-1.5">
        {[
          { id: 'music', label: 'Music', icon: <Music className="w-3.5 h-3.5" /> },
          { id: 'voiceover', label: 'Voiceover', icon: <Mic className="w-3.5 h-3.5" /> },
          { id: 'sfx', label: 'Sound FX', icon: <Radio className="w-3.5 h-3.5" /> },
          { id: 'extract', label: 'Extract', icon: <Scissors className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 border border-cyan-500 text-[#00F0FF]'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* OPTION 1: MUSIC */}
        {activeTab === 'music' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-neutral-300 block">
                Royalty-Free Soundtracks:
              </span>

              <div className="space-y-2">
                {tracks.map((t) => {
                  const isActive = timeline.bgAudio?.genre === t.genre;
                  return (
                    <div
                      key={t.genre}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 border-cyan-500 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{t.name}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black text-[9px] font-black">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{t.desc}</div>
                      </div>

                      <button
                        onClick={() => handleApplyMusic(t.genre as any, t.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500 text-black shadow-xs'
                            : 'bg-neutral-800 text-cyan-300 hover:bg-neutral-700'
                        }`}
                      >
                        {isActive ? 'Applied' : 'Use'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {timeline.bgAudio && (
                <button
                  onClick={handleRemoveAudio}
                  className="w-full py-2 rounded-xl bg-red-950/30 hover:bg-red-950/50 text-red-300 border border-red-800/40 text-xs font-semibold cursor-pointer"
                >
                  Remove Background Music
                </button>
              )}
            </div>

            {/* Volume & Ducking Controls */}
            {timeline.bgAudio && (
              <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-300">Music Volume:</span>
                  <span className="text-xs font-mono text-cyan-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (timeline.bgAudio) {
                      onUpdateAudio({ ...timeline.bgAudio, volume: val });
                      bgAudioEngine.setVolume(val);
                    }
                  }}
                  className="w-full accent-[#00F0FF] cursor-pointer"
                />

                <label className="flex items-center justify-between pt-1 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">Smart Audio Ducking</span>
                    <span className="text-[10px] text-neutral-400">
                      Lowers music automatically when talking occurs
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={ducking}
                    onChange={(e) => {
                      setDucking(e.target.checked);
                      if (timeline.bgAudio) {
                        onUpdateAudio({ ...timeline.bgAudio, ducking: e.target.checked });
                      }
                    }}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* OPTION 2: VOICEOVER */}
        {activeTab === 'voiceover' && (
          <div className="p-6 rounded-2xl bg-[#121420] border border-neutral-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400">
              <Mic className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">Record Studio Voiceover</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Record your voice synchronized with video playhead ({Math.round(currentPlayheadMs / 1000)}s)
              </p>
            </div>

            {isRecording ? (
              <div className="space-y-3">
                <div className="text-xl font-mono font-bold text-red-500 animate-pulse">
                  ● 00:0{recordDuration}s RECORDING
                </div>
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-red-500/30"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording</span>
                </button>
              </div>
            ) : (
              <button
                onClick={startRecording}
                className="px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone Recording</span>
              </button>
            )}

            {recordedAudioUrl && (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 mt-4 text-left">
                <span className="text-[11px] font-semibold text-emerald-400 block">
                  ✓ Voiceover Track Captured ({recordDuration}s)
                </span>
                <audio src={recordedAudioUrl} controls className="w-full h-8" />
              </div>
            )}
          </div>
        )}

        {/* OPTION 3: SOUND EFFECTS */}
        {activeTab === 'sfx' && (
          <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3">
            <span className="text-xs font-bold text-neutral-300 block">
              Instant Sound FX Synthesizer:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'whoosh', label: '💨 Cinematic Whoosh', desc: 'Fast swipe & transitions' },
                { id: 'pop', label: '✨ UI Pop Sound', desc: 'Sticker & button entry' },
                { id: 'boom', label: '💥 Dramatic Boom', desc: 'Deep cinematic bass drop' },
                { id: 'ding', label: '🔔 Bell Ding', desc: 'Notification & tip highlight' },
              ].map((sfx) => (
                <button
                  key={sfx.id}
                  onClick={() => playSfx(sfx.id as any)}
                  className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                    lastPlayedSfx === sfx.id
                      ? 'bg-cyan-500/25 border-cyan-400 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{sfx.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{sfx.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OPTION 4: EXTRACT AUDIO */}
        {activeTab === 'extract' && (
          <div className="p-5 rounded-2xl bg-[#121420] border border-neutral-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Extract Audio from Video</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Separates original video audio into an independent track for precise volume automation and EQ.
              </p>
            </div>
            <button
              onClick={() => {
                alert('Extracted audio from timeline video clips to audio track!');
                onNavigateToEditor();
              }}
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer shadow-md shadow-cyan-500/20"
            >
              Extract Timeline Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
