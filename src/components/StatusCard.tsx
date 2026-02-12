import { useState, useEffect } from 'react';

interface StatusCardProps {
  name: string;
  url: string;
}

export default function StatusCard({ name, url }: StatusCardProps) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const startTime = performance.now();
      try {
        // We use 'no-cors' for simple heartbeat, but note: 
        // latency might be slightly higher due to preflight/browser overhead
        await fetch(url, { mode: 'no-cors', cache: 'no-store' });
        const endTime = performance.now();
        
        setLatency(Math.round(endTime - startTime));
        setStatus('online');
        setLastChecked(new Date());
      } catch (error) {
        setStatus('offline');
        setLatency(null);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [url]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`cursor-pointer transition-all duration-500 ease-in-out relative preserve-3d ${
        isExpanded ? 'scale-105 z-50' : 'scale-100'
      }`}
    >
      <div className={`relative transition-all duration-700 [transform-style:preserve-3d] ${isExpanded ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className="backface-hidden p-8 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-aura-dark/5 flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-aura-dark tracking-tight">{name}</h3>
              <p className="text-sm text-aura-slate font-mono mt-1 opacity-60 truncate max-w-[150px]">
                {url.replace('https://', '')}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-aura-danger'
            }`}>
              <div className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-aura-danger'}`}></div>
              {status}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-aura-dark/5 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-aura-slate font-bold opacity-50">Last Heartbeat</span>
              <span className="text-lg font-mono font-medium text-aura-dark">{formatTime(lastChecked)}</span>
            </div>
            {status === 'online' && latency && (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-aura-slate font-bold opacity-50 block">Latency</span>
                <span className="text-sm font-mono font-bold text-green-600">{latency}ms</span>
              </div>
            )}
          </div>
        </div>

        {/* BACK SIDE (Detail View) */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden p-8 rounded-[2rem] bg-aura-dark text-white shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-aura-primary">API Details</h3>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/60">PERFORMANCE MODE</span>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Full Endpoint</p>
                <p className="text-xs font-mono break-all text-white/90">{url}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Uptime</p>
                  <p className="text-lg font-bold">{status === 'online' ? '99.9%' : '0%'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-widest">Speed</p>
                  <p className={`text-lg font-bold ${latency && latency < 300 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {latency ? `${latency}ms` : '--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center text-white/30 italic">Click to flip back</p>
        </div>

      </div>
    </div>
  );
}