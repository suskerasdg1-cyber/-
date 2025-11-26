import React, { useEffect, useRef } from 'react';

interface BattleLogProps {
  logs: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm shadow-inner" ref={scrollRef}>
      {logs.length === 0 ? (
        <p className="text-gray-500 italic">战斗即将开始...</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="mb-2 border-b border-slate-800 pb-1 last:border-0 animate-pulse">
            <span className="text-green-400 mr-2">➤</span>
            {log}
          </div>
        ))
      )}
    </div>
  );
};

export default BattleLog;
