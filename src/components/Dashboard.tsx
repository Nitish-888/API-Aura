import { useState, useEffect } from 'react';
import StatusCard from './StatusCard';

interface Project {
  name: string;
  url: string;
  isPinned?: boolean;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aura-projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    // Prevent duplicate URLs
    if (projects.some(p => p.url === url)) {
      alert("This API is already being monitored.");
      return;
    }

    const newProjects = [...projects, { name, url, isPinned: false }];
    setProjects(newProjects);
    localStorage.setItem('aura-projects', JSON.stringify(newProjects));
    setName('');
    setUrl('');
  };

  const togglePin = (targetUrl: string) => {
    const updated = projects.map(p =>
      p.url === targetUrl ? { ...p, isPinned: !p.isPinned } : p
    );
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
  };

  const deleteProject = (targetUrl: string) => {
    const updated = projects.filter(p => p.url !== targetUrl);
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
  };

  // 1. Filter based on search query
  // 2. Sort so pinned items (true) come before unpinned (false)
  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-12">
      {/* Search & Add Section */}
      <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-xl">
        <div className="mb-8">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-aura-slate mb-3 ml-2 opacity-60">
            Quick Search
          </label>
          <input
            type="text"
            placeholder="Search by API name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-6 py-4 rounded-2xl bg-white/50 border-none ring-1 ring-aura-dark/10 focus:ring-2 focus:ring-aura-primary transition-all outline-none text-aura-dark placeholder:text-aura-slate/50"
          />
        </div>

        <form onSubmit={addProject} className="flex flex-wrap gap-4 pt-6 border-t border-aura-dark/5">
          <input
            type="text"
            placeholder="API Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-white/50 border-none ring-1 ring-aura-dark/10 focus:ring-2 focus:ring-aura-primary transition-all outline-none"
          />
          <input
            type="text"
            placeholder="API URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 min-w-[200px] px-6 py-4 rounded-2xl bg-white/50 border-none ring-1 ring-aura-dark/10 focus:ring-2 focus:ring-aura-primary transition-all outline-none"
          />
          <button type="submit" className="px-8 py-4 bg-aura-dark text-white rounded-2xl font-bold hover:bg-aura-dark/90 transition-all shadow-lg shadow-aura-dark/20">
            Add Project
          </button>
        </form>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div key={project.url} className="relative group">
            <StatusCard name={project.name} url={project.url} />

            {/* Quick Actions overlay */}
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-[60]">
              <button
                onClick={(e) => { e.stopPropagation(); togglePin(project.url); }}
                title={project.isPinned ? "Unpin" : "Pin to top"}
                className={`p-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 shadow-sm ${project.isPinned
                    ? 'bg-aura-primary text-white border-aura-primary scale-110 shadow-aura-primary/20'
                    : 'bg-white/90 text-aura-dark border-white hover:bg-white'
                  }`}
              >
                <span className={project.isPinned ? "brightness-200" : ""}>📌</span>
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); deleteProject(project.url); }}
                title="Remove project"
                className="p-2.5 bg-red-500/80 text-white rounded-xl backdrop-blur-md border border-red-400 hover:bg-red-500 transition-colors shadow-sm"
              >
                ✕
              </button>
            </div>

            {/* Visual Indicator for Pinned Items */}
            {project.isPinned && (
              <div className="absolute -top-2 -left-2 bg-aura-primary text-[10px] text-white font-bold px-3 py-1 rounded-full shadow-lg z-50 animate-in fade-in zoom-in duration-300">
                PINNED
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white/20 rounded-[3rem] border-2 border-dashed border-white/40">
          <p className="text-aura-slate font-medium">No APIs found. Try a different search or add a new project.</p>
        </div>
      )}
    </div>
  );
} 