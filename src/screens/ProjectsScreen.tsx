import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Film,
  Play,
  Clock,
  Trash2,
  Copy,
  Edit2,
  Check,
  Search,
} from 'lucide-react';
import { AppScreen, ProjectTimeline, SavedProject } from '../types';

interface ProjectsScreenProps {
  onBack: () => void;
  projects?: SavedProject[];
  onOpenProject: (timeline: ProjectTimeline) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onNewProject: () => void;
  onRenameProject?: (id: string, newName: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  onBack,
  projects = [],
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  onNewProject,
  onRenameProject,
}) => {
  const safeProjects = projects || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const filtered = safeProjects.filter((p) =>
    (p?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const startRenaming = (p: SavedProject) => {
    setEditingId(p.id);
    setTempName(p.name);
  };

  const saveRename = (id: string) => {
    if (tempName.trim()) {
      onRenameProject(id, tempName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0B10] text-white select-none">
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
            <h1 className="text-sm font-bold tracking-wide text-white">PROJECTS</h1>
            <p className="text-[10px] text-neutral-400">Manage and resume your video edits</p>
          </div>
        </div>

        <button
          onClick={onNewProject}
          className="px-3 py-1.5 rounded-xl bg-[#00F0FF] hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="p-4 border-b border-neutral-900/80 bg-[#0C0E14]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved projects..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Film className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 font-medium">No projects found</p>
            <button
              onClick={onNewProject}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-semibold cursor-pointer"
            >
              Create New Project
            </button>
          </div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-3.5 rounded-2xl bg-[#121420] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col gap-3 group"
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div
                  onClick={() => onOpenProject(proj.timeline)}
                  className="w-20 h-20 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden relative cursor-pointer group-hover:border-cyan-500/50 transition-colors"
                >
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
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                    {formatDuration(proj.durationMs)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 overflow-hidden space-y-1">
                  {editingId === proj.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-neutral-800 border border-cyan-500 rounded px-2 py-0.5 text-xs text-white flex-1"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(proj.id)}
                        className="p-1 rounded bg-cyan-500 text-black"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h3
                        onClick={() => onOpenProject(proj.timeline)}
                        className="text-xs font-bold text-white hover:text-[#00F0FF] truncate cursor-pointer transition-colors"
                      >
                        {proj.name}
                      </h3>
                      <button
                        onClick={() => startRenaming(proj)}
                        className="text-neutral-500 hover:text-neutral-300 p-0.5 cursor-pointer"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-300">
                      {proj.timeline?.aspectRatio || '9:16'}
                    </span>
                    <span>{proj.timeline?.clips?.length || 0} clips</span>
                    <span>{proj.timeline?.captions?.length || 0} captions</span>
                  </div>

                  <p className="text-[10px] text-neutral-500">
                    Modified: {formatDate(proj.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                <button
                  onClick={() => onOpenProject(proj.timeline)}
                  className="py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open in Editor</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicateProject(proj.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
