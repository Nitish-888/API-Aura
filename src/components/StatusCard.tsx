import { useState, useEffect } from 'react';

interface Props {
  name: string;
  url: string;
}

export default function StatusCard({ name, url }: Props) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [latency, setLatency] = useState<number | null>(null);

  const checkStatus = async () => {
    const start = performance.now();
    try {
      await fetch(url, { mode: 'no-cors' }); 
      const end = performance.now();
      setStatus('online');
      setLatency(Math.round(end - start));
    } catch (error) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [url]);

  return (
    /* Increased opacity from /25 to /70 for a more solid, premium feel */
    <div className="p-8 rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/50 shadow-xl shadow-aura-dark/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/80">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-aura-dark tracking-tight font-sans">
          {name}
        </h3>
        {/* Restored Classic Green and Red Status Indicators */}
        <div className={`h-2.5 w-2.5 rounded-full ${
          status === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
          status === 'offline' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-aura-slate animate-pulse'
        }`}></div>
      </div>
      
      <div className="mt-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-aura-slate/80 font-sans">
            Latency
          </p>
          <p className="text-2xl font-mono text-aura-dark">
            {latency ? `${latency}ms` : '--'}
          </p>
        </div>
        <p className={`text-[10px] font-bold uppercase py-1 px-2 rounded-md font-sans ${
          status === 'online' ? 'bg-green-100 text-green-700' : 
          status === 'offline' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {status}
        </p>
      </div>
    </div>
  );
}