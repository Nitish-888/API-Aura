import { useState, useEffect } from 'react';

interface StatusCardProps {
  name: string;
  url: string;
}

export default function StatusCard({ name, url }: StatusCardProps) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Using 'no-cors' mode to avoid CORS issues for simple heartbeat checks
        await fetch(url, { mode: 'no-cors' });
        setStatus('online');
        setLastChecked(new Date());
      } catch (error) {
        setStatus('offline');
        console.error(`Error checking ${name}:`, error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [url, name]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-8 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-aura-dark/5 flex flex-col justify-between min-h-[200px] transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-aura-dark tracking-tight">{name}</h3>
          <p className="text-sm text-aura-slate font-mono mt-1 opacity-60 truncate max-w-[150px]">
            {url.replace('https://', '')}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          status === 'online' ? 'bg-green-100 text-green-600' : 
          status === 'offline' ? 'bg-red-100 text-aura-danger' : 
          'bg-gray-100 text-aura-slate'
        }`}>
          <div className={`h-2 w-2 rounded-full ${
            status === 'online' ? 'bg-green-500 animate-pulse' : 
            status === 'offline' ? 'bg-aura-danger' : 
            'bg-aura-slate animate-pulse'
          }`}></div>
          {status}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-aura-dark/5 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-aura-slate font-bold opacity-50">Last Heartbeat</span>
          <span className="text-lg font-mono font-medium text-aura-dark">
            {formatTime(lastChecked)}
          </span>
        </div>
        <div className="h-8 w-12 bg-aura-bg/30 rounded-lg flex items-center justify-center">
           {/* Tiny sparkline placeholder for visual flair */}
           <div className="flex gap-0.5 items-end">
              <div className="w-1 bg-aura-primary h-2"></div>
              <div className="w-1 bg-aura-primary h-4"></div>
              <div className="w-1 bg-aura-primary h-3"></div>
              <div className="w-1 bg-aura-primary h-5"></div>
           </div>
        </div>
      </div>
    </div>
  );
}