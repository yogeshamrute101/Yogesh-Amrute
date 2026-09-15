import React, { useState } from 'react';
import { X, Smile, Sparkles, Plus, Check } from 'lucide-react';
import { StickerItem } from '../types';

import { bgAudioEngine } from '../utils/audioSynth';

interface StickerOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (sticker: Omit<StickerItem, 'id'>) => void;
  existingStickers?: StickerItem[];
  onRemoveSticker?: (id: string) => void;
  currentPlayheadMs: number;
}

const VIRAL_BADGES = [
  '🔥 VIRAL',
  '🚨 MUST WATCH',
  '⚠️ NEW HACK',
  '⚡ 10X PRO',
  '🎯 SECRET',
  '👀 WAIT FOR IT',
  '💯 FACTS',
  '🏆 WINNER',
  '✨ MAGIC',
  '📈 SCALING',
];

const EMOJI_STICKERS = [
  '🔥', '🚀', '😱', '🤯', '💸', '⚡', '🍿', '🏆', '✨', '📈', '🤩', '💡', '🤖', '👑', '🎉', '👇'
];

export const StickerOverlayModal: React.FC<StickerOverlayModalProps> = ({
  isOpen,
  onClose,
  onAddSticker,
  existingStickers,
  onRemoveSticker,
  currentPlayheadMs,
}) => {
  if (!isOpen) return null;

  const [selectedContent, setSelectedContent] = useState('🔥 VIRAL');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('top');
  const [animation, setAnimation] = useState<'pop' | 'pulse' | 'slide' | 'none'>('pop');
  const [scale, setScale] = useState(1.2);
  const [durationSec, setDurationSec] = useState(3.5);

  const handleAdd = () => {
    let y = 20;
    if (position === 'center') y = 50;
    if (position === 'bottom') y = 80;

    bgAudioEngine.playSfx('pop');
    onAddSticker({
      content: selectedContent,
      startMs: currentPlayheadMs,
      endMs: currentPlayheadMs + durationSec * 1000,
      x: 50,
      y,
      scale,
      rotation: 0,
      animation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#12131a] border border-neutral-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#161822]">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Stickers & Viral Badges</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-neutral-200">
          
          {/* Viral Badges Grid */}
          <div>
            <span className="text-[11px] text-neutral-400 block mb-2 font-medium">Trending Hook Badges</span>
            <div className="grid grid-cols-2 gap-2">
              {VIRAL_BADGES.map((badge) => (
                <button
                  key={badge}
                  onClick={() => setSelectedContent(badge)}
                  className={`p-2.5 rounded-xl border text-left font-bold text-xs cursor-pointer transition-all ${
                    selectedContent === badge
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Emojis */}
          <div>
            <span className="text-[11px] text-neutral-400 block mb-2 font-medium">Animated Reaction Emojis</span>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_STICKERS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedContent(emoji)}
                  className={`h-10 text-xl rounded-xl border flex items-center justify-center cursor-pointer transition-transform ${
                    selectedContent === emoji
                      ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-sm'
                      : 'bg-neutral-800/60 border-neutral-700/60 hover:bg-neutral-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Position Selection */}
          <div>
            <span className="text-[11px] text-neutral-400 block mb-2 font-medium">Vertical Placement</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'top', label: 'Top (Hook)' },
                { id: 'center', label: 'Center (Focus)' },
                { id: 'bottom', label: 'Bottom' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPosition(p.id as any)}
                  className={`p-2 rounded-xl border font-medium cursor-pointer transition-colors text-center ${
                    position === p.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Style */}
          <div>
            <span className="text-[11px] text-neutral-400 block mb-2 font-medium">Entry Animation</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'pop', label: '💥 Pop' },
                { id: 'pulse', label: '💓 Pulse' },
                { id: 'slide', label: '⚡ Slide' },
                { id: 'none', label: 'Static' },
              ].map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAnimation(a.id as any)}
                  className={`p-2 rounded-xl border text-center font-medium cursor-pointer transition-colors ${
                    animation === a.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Stickers on Timeline */}
          {existingStickers.length > 0 && (
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-2 font-medium">Active Stickers on Timeline ({existingStickers.length})</span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {existingStickers.map((stk) => (
                  <div key={stk.id} className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="font-bold text-neutral-200 truncate">{stk.content}</span>
                    <button
                      onClick={() => onRemoveSticker(stk.id)}
                      className="text-red-400 hover:text-red-300 text-[10px] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
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
            onClick={handleAdd}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sticker</span>
          </button>
        </div>

      </div>
    </div>
  );
};
