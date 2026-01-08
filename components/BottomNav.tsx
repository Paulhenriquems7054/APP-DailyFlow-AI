
import React from 'react';
import { Calendar, Flame, BarChart3, Plus } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../translations';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
  language: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onAddClick, language }) => {
  const t = getT(language);
  const tabs = [
    { id: 'routine', icon: Calendar, label: t.routine },
    { id: 'habits', icon: Flame, label: t.habits },
    { id: 'insights', icon: BarChart3, label: t.insights },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800/50 px-6 py-3 flex justify-around items-center z-50 transition-colors">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] uppercase font-bold tracking-widest">{tab.label}</span>
        </button>
      ))}
      <button 
        onClick={onAddClick}
        className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/30 -mt-8 border-4 border-zinc-50 dark:border-zinc-950 hover:scale-110 transition-all active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default BottomNav;
