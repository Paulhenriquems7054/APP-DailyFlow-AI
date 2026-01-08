
import React, { useState, useEffect } from 'react';
import { Play, Pause, X, RotateCcw, Zap } from 'lucide-react';
import { Language, Task } from '../types';
import { getT } from '../translations';

interface FocusTimerProps {
  task: Task;
  onClose: () => void;
  language: Language;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ task, onClose, language }) => {
  const t = getT(language);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      // Aqui poderíamos emitir um som ou notificação
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - seconds) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-zinc-950/90 backdrop-blur-2xl p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-12 text-center">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{t.focus_mode}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{task.title}</h2>
          <p className="text-zinc-500 text-sm max-w-[250px] mx-auto">{task.description}</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-zinc-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={753.9}
              strokeDashoffset={753.9 - (753.9 * progress) / 100}
              className="text-emerald-500 transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-7xl font-light tracking-tighter tabular-nums text-white">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSeconds(25 * 60)}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isActive 
                ? 'bg-zinc-100 text-zinc-900 scale-110 shadow-xl shadow-white/10' 
                : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
          </button>
          <button 
            onClick={onClose}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
