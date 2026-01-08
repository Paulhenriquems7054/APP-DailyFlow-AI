
import React from 'react';
import { Sparkles, Languages, Sun, Moon } from 'lucide-react';
import { Language, Theme } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
  theme: Theme;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageToggle, theme, onThemeToggle }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-white/70 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">DailyFlow</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onThemeToggle}
          className="p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-90"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />
          )}
        </button>
        <button 
          onClick={onLanguageToggle}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95"
        >
          <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
            {language === 'en' ? 'EN' : 'PT'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
