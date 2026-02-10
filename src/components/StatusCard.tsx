import { useState, useEffect } from 'react';

interface Props {
  name: string;
  url: string;
}

export default function StatusCard({ name, url }: Props) {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const start = performance.now();
      try {
        // 'no-cors' is a simple way to ping without hitting CORS issues for the demo
        await fetch(url, { mode: 'no-cors' }); 
        const end = performance.now();
        setStatus('online');
        setLatency(Math.round(end - start));
      } catch (error) {
        setStatus('offline');
      }
    };
    checkStatus();
  }, [url]);

  return (
    <div className="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-[#6A89A7]/20 shadow-sm transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-[#384959] font-sans">{name}</h3>
        <div className={`h-3 w-3 rounded-full ${
          status === 'online' ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 
          status === 'offline' ? 'bg-[#CD1C18]' : 'bg-gray-400 animate-pulse'
        }`}></div>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#6A89A7] font-sans font-bold">Latency</p>
          <p className="text-2xl font-mono text-[#384959]">
            {latency ? `${latency}ms` : '--'}
          </p>
        </div>
        <p className={`text-xs font-bold font-sans uppercase ${status === 'online' ? 'text-green-600' : 'text-[#CD1C18]'}`}>
          {status}
        </p>
      </div>
    </div>
  );
}