import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StatusCard from './StatusCard';

export default function SortableCard({ project, togglePin, deleteProject }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group touch-none">
      <div {...attributes} {...listeners}>
        <StatusCard name={project.name} url={project.url} />
      </div>
      
      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-[60]">
         <button 
          onClick={(e) => { e.stopPropagation(); togglePin(project.url); }}
          className={`p-2.5 rounded-xl border transition-all ${project.isPinned ? 'bg-aura-primary text-white border-aura-primary' : 'bg-white/90 text-aura-dark border-white'}`}
        >
          📌
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); deleteProject(project.url); }}
          className="p-2.5 bg-red-500/80 text-white rounded-xl"
        >
          ✕
        </button>
      </div>

      {project.isPinned && (
        <div className="absolute -top-2 -left-2 bg-aura-primary text-[10px] text-white font-bold px-3 py-1 rounded-full shadow-lg z-50">
          PINNED
        </div>
      )}
    </div>
  );
}