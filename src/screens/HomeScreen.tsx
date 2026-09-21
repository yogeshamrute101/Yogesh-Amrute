import React, { useRef } from 'react';
import {
  Sparkles,
  Plus,
  Zap,
  Bot,
  FileText,
  Type,
  FolderKanban,
  Settings,
  Film,
  Play,
  Clock,
  ChevronRight,
  Trash2,
  Copy,
} from 'lucide-react';
import { AppScreen, ProjectTimeline, SavedProject, TimelineClip } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenProject: (timeline: ProjectTimeline) => void;
  recentProjects?: SavedProject[];
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onCreateNewProjectWithFiles: (files: FileList) => void;
  onCreateEmptyProject: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenProject,
  recentProjects = [],
  onDeleteProject,
  onDuplicateProject,
  onCreateNewProjectWithFiles,
  onCreateEmptyProject,
}) => {
  const safeProjects = recentProjects || [];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMediaPickerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onCreateNewProjectWithFiles(e.target.files);
    }
  };

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const diffDays = Math.floor((Date.now() - timestamp) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B10] text-white overflow-y-auto pb-20 select-none">
      {/* Hidden File Picker for Real Media Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*,image/*"
        multiple
        className="hidden"
      />

      {/* TOP HEADER */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between border-b border-neutral-900 bg-[#0E1018]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00F0FF] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-black font-black" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              VIDOAI STUDIO
            </h1>
            <p className="text-[11px] text-[#00F0FF] font-medium tracking-wide">
              AI-powered video creation
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {/* PRIMARY ACTION: + NEW PROJECT CARD */}
        <div className="relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#121424] to-[#1d1630] border border-cyan-500/40 shadow-xl shadow-cyan-500/10">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[70%]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00F0FF]">
                Start Creating
              </span>
              <h2 className="text-lg font-black text-white">Create New Video</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Select video clips from your device or start a blank project.
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#00F0FF] text-black flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex gap-2.5">
            <button
              onClick={handleMediaPickerClick}
              className="flex-1 py-3 px-4 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20 active:scale-98 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Select Videos</span>
            </button>
            <button
              onClick={onCreateEmptyProject}
              className="py-3 px-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
            >
              <span>Sample Demo</span>
            </button>
          </div>
        </div>

        {/* AI CAPABILITY GRID CARDS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              AI Creative Suites
            </h3>
            <span className="text-[10px] text-[#8B5CF6] font-mono font-medium">Gemini 3.8</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* AI Reel Maker */}
            <button
              onClick={() => onNavigate('reel_maker')}
              className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between h-32"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  AI Reel Maker
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Auto-cuts, hook & music sync
                </p>
              </div>
            </button>

            {/* AI Co-Pilot */}
            <button
              className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between h-32"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                  AI Co-Pilot
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Natural-language commands
                </p>
              </div>
            </button>

            {/* AI Script */}
            <button
              onClick={() => onNavigate('script_writer')}
              className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 hover:border-violet-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between h-32"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                  AI Script
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Viral hooks & scene breakdowns
                </p>
              </div>
            </button>

            {/* Captions */}
            <button
              onClick={() => onNavigate('captions')}
              className="p-4 rounded-2xl bg-[#121420] border border-neutral-800 hover:border-pink-500/50 text-left transition-all group cursor-pointer flex flex-col justify-between h-32"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                  Captions
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Animated viral subtitles
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* RECENT PROJECTS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Recent Projects ({safeProjects.length})
            </h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-[11px] text-[#00F0FF] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {safeProjects.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#11131c] border border-neutral-800/80 text-center space-y-2">
              <Film className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400 font-medium">No projects saved yet</p>
              <p className="text-[11px] text-neutral-500">
                Tap "+ New Project" above to create your first video.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {safeProjects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-2xl bg-[#121420] border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between group"
                >
                  <div
                    onClick={() => onOpenProject(proj.timeline)}
                    className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden relative group-hover:border-cyan-500/40 transition-colors">
                      {proj.thumbnailUrl ? (
                        <img
                          src={proj.thumbnailUrl}
                          alt={proj.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
                          <Film className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="overflow-hidden pr-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">
                        {proj.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          {formatDuration(proj.durationMs)}
                        </span>
                        <span>•</span>
                        <span>{formatDate(proj.updatedAt)}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{proj.timeline.aspectRatio}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
