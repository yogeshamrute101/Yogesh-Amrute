import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Film,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { AiScriptResponse, CaptionItem, ProjectTimeline } from '../types';

interface AiScriptScreenProps {
  onBack: () => void;
  timeline?: ProjectTimeline;
  onApplyScriptAsCaptions?: (captions: CaptionItem[]) => void;
  onNavigateToEditor?: () => void;
}

export const AiScriptScreen: React.FC<AiScriptScreenProps> = ({
  onBack,
  timeline,
  onApplyScriptAsCaptions,
  onNavigateToEditor,
}) => {
  const [topic, setTopic] = useState('Top 3 Game-Changing AI Video Editing Hacks in 2026');
  const [language, setLanguage] = useState('English');
  const [durationSec, setDurationSec] = useState(30);
  const [style, setStyle] = useState('Viral TikTok / Reel');
  const [loading, setLoading] = useState(false);
  const [scriptResult, setScriptResult] = useState<AiScriptResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [editableScriptText, setEditableScriptText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          durationSec,
          vibe: style,
          aspectRatio: timeline?.aspectRatio || '9:16',
          language,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to generate script');
      }

      const scriptData: AiScriptResponse = data.data;
      setScriptResult(scriptData);

      // Build editable full text
      let text = `🎬 TITLE: ${scriptData.title}\n🪝 HOOK: ${scriptData.hook}\n\n`;
      scriptData.scenes.forEach((sc, i) => {
        text += `[Scene ${i + 1} - ${sc.durationSec}s]\nVISUAL: ${sc.visualDescription}\nVOICEOVER: "${sc.voiceover}"\n\n`;
      });
      text += `🎯 CALL TO ACTION: ${scriptData.callToAction}\n`;
      if (scriptData.suggestedHashtags?.length) {
        text += `🏷️ HASHTAGS: ${scriptData.suggestedHashtags.join(' ')}`;
      }
      setEditableScriptText(text);
    } catch (err: any) {
      setErrorMsg(err.message || 'AI script generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToTimeline = () => {
    if (!scriptResult || !scriptResult.scenes) return;

    let cursorMs = 0;
    const newCaptions: CaptionItem[] = scriptResult.scenes.map((scene, idx) => {
      const durMs = Math.round((scene.durationSec || 4) * 1000);
      const cap: CaptionItem = {
        id: `cap_script_${Date.now()}_${idx}`,
        text: scene.voiceover || scene.textOverlay || '...',
        startMs: cursorMs,
        endMs: cursorMs + durMs,
        style: 'yellow_viral',
        position: 'bottom',
      };
      cursorMs += durMs;
      return cap;
    });

    onApplyScriptAsCaptions(newCaptions);
    onNavigateToEditor();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableScriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <h1 className="text-sm font-bold tracking-wide text-white">AI SCRIPT WRITER</h1>
            <p className="text-[10px] text-neutral-400">Generate viral video hooks & screenplays</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* INPUT FORM */}
        <div className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Video Topic / Prompt:
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              placeholder="e.g. 3 Hidden Travel Secrets for Rome or Product Launch Hook"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Duration:
              </label>
              <div className="flex gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                {[15, 30, 60].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDurationSec(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      durationSec === s ? 'bg-violet-500 text-white shadow-xs' : 'text-neutral-400'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
              Creative Style:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Viral TikTok / Reel',
                'Informative Tutorial',
                'Cinematic Story',
                'Sales Pitch / Ad',
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                    style === st
                      ? 'bg-violet-500/20 border-violet-400 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs font-bold block">{st}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={loading || !topic.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scripting with Gemini 3.8...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Script</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* OUTPUT AREA */}
        {scriptResult && (
          <div className="p-4 rounded-2xl bg-[#121420] border border-violet-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">{scriptResult.title}</h3>
                <span className="text-[10px] text-violet-400 font-mono">
                  Viral Score: {scriptResult.viralScore || 95}/100
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              value={editableScriptText}
              onChange={(e) => setEditableScriptText(e.target.value)}
              rows={8}
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-violet-500"
            />

            <button
              onClick={handleApplyToTimeline}
              className="w-full py-3 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Script to Timeline as Captions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
