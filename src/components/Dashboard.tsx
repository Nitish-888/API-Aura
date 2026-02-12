import { useState, useEffect } from 'react';
import StatusCard from './StatusCard';

interface Project {
  id: number;
  name: string;
  url: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // Load projects from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aura-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    const newProject = { id: Date.now(), name, url };
    const updated = [...projects, newProject];
    
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
    
    setName('');
    setUrl('');
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
  };

  return (
    <div>
      <form onSubmit={addProject} className="mb-12 flex flex-col md:flex-row gap-4 p-6 rounded-[1.5rem] bg-white/40 backdrop-blur-md border border-white/50 shadow-lg shadow-aura-dark/5">
        <input 
          type="text" 
          placeholder="API Name (e.g. Github API)" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-aura-primary text-aura-dark placeholder:text-aura-slate/60 font-sans"
          required
        />
        <input 
          type="url" 
          placeholder="API Link (https://your-link.com)" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-aura-primary text-aura-dark placeholder:text-aura-slate/60 font-sans"
          required
        />
        <button type="submit" className="px-8 py-3 bg-aura-dark text-white rounded-xl font-bold hover:bg-aura-dark/80 transition-all active:scale-95 font-sans whitespace-nowrap">
          Add Project
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Default Static Card */}
        <StatusCard name="GitHub" url="https://api.github.com" />
        
        {/* Dynamic Cards from LocalStorage */}
        {projects.map((project) => (
          <div key={project.id} className="relative group">
            <StatusCard name={project.name} url={project.url} />
            <button 
              onClick={() => deleteProject(project.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}