import { useState, useEffect } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent 
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import SortableCard from './SortableCard';

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const saved = localStorage.getItem('aura-projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.url === active.id);
        const newIndex = items.findIndex((i) => i.url === over.id);
        const updated = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('aura-projects', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || projects.some(p => p.url === url)) return;
    const newProjects = [...projects, { name, url, isPinned: false }];
    setProjects(newProjects);
    localStorage.setItem('aura-projects', JSON.stringify(newProjects));
    setName(''); setUrl('');
  };

  const togglePin = (targetUrl: string) => {
    const updated = projects.map(p => p.url === targetUrl ? { ...p, isPinned: !p.isPinned } : p);
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
  };

  const deleteProject = (targetUrl: string) => {
    const updated = projects.filter(p => p.url !== targetUrl);
    setProjects(updated);
    localStorage.setItem('aura-projects', JSON.stringify(updated));
  };

  // Export Projects to JSON
  const exportProjects = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `aura-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  // Import Projects from JSON
  const importProjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setProjects((current) => {
            const existingUrls = new Set(current.map(p => p.url));
            const newOnes = imported.filter(p => !existingUrls.has(p.url));
            const combined = [...current, ...newOnes];
            localStorage.setItem('aura-projects', JSON.stringify(combined));
            return combined;
          });
          alert(`Successfully processed file. Added new projects found.`);
        }
      } catch (err) {
        alert("Error reading backup file. Please ensure it is a valid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-32">
      {/* Search & Add Section */}
      <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-xl">
        <input
          type="text"
          placeholder="Search your APIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-6 py-4 rounded-2xl bg-white/50 border-none ring-1 ring-aura-dark/10 outline-none mb-6 text-aura-dark placeholder:text-aura-slate/50"
        />
        <form onSubmit={addProject} className="flex flex-wrap gap-4 pt-6 border-t border-aura-dark/5">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-6 py-4 rounded-2xl bg-white/50 ring-1 ring-aura-dark/10 focus:ring-2 focus:ring-aura-primary transition-all outline-none" />
          <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 px-6 py-4 rounded-2xl bg-white/50 ring-1 ring-aura-dark/10 focus:ring-2 focus:ring-aura-primary transition-all outline-none" />
          <button type="submit" className="px-8 py-4 bg-aura-dark text-white rounded-2xl font-bold hover:bg-aura-dark/90 transition-all shadow-lg shadow-aura-dark/20">
            Add Project
          </button>
        </form>

        {/* Backup Actions */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-aura-dark/5">
          <button 
            onClick={exportProjects}
            className="flex items-center gap-2 px-6 py-3 bg-white/60 text-aura-dark rounded-xl font-bold hover:bg-white transition-all border border-white/40 shadow-sm"
          >
            📤 Export JSON
          </button>
          
          <label className="flex items-center gap-2 px-6 py-3 bg-aura-primary/20 text-aura-dark rounded-xl font-bold hover:bg-aura-primary/30 transition-all border border-aura-primary/20 cursor-pointer shadow-sm">
            📥 Import JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={importProjects} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Grid with Drag and Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredProjects.map(p => p.url)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <SortableCard 
                key={project.url} 
                project={project} 
                togglePin={togglePin} 
                deleteProject={deleteProject} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white/20 rounded-[3rem] border-2 border-dashed border-white/40">
          <p className="text-aura-slate font-medium">No APIs found. Try adding a new project.</p>
        </div>
      )}
    </div>
  );
}