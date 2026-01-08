
import React, { useState } from 'react';
import { Task, RoutineBlock, Language } from '../types';
import { CheckCircle2, Circle, Sun, Cloud, Moon, StickyNote, Edit2, PlayCircle, Zap } from 'lucide-react';
import { getT } from '../translations';

interface RoutineBlockViewProps {
  block: RoutineBlock;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onFocusTask: (task: Task) => void;
  language: Language;
}

const RoutineBlockView: React.FC<RoutineBlockViewProps> = ({ block, tasks, onToggleTask, onEditTask, onFocusTask, language }) => {
  const t = getT(language);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNotes = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEditClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onEditTask(task);
  };

  const handleFocusClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onFocusTask(task);
  };

  const getIcon = () => {
    switch (block) {
      case RoutineBlock.MORNING: return <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case RoutineBlock.AFTERNOON: return <Cloud className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
      case RoutineBlock.EVENING: return <Moon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  const getBlockLabel = () => {
    switch (block) {
      case RoutineBlock.MORNING: return t.morning;
      case RoutineBlock.AFTERNOON: return t.afternoon;
      case RoutineBlock.EVENING: return t.evening;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{getBlockLabel()}</h3>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-zinc-400 dark:text-zinc-600 text-sm italic">...</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer group/card ${
                task.completed 
                  ? 'bg-zinc-100 dark:bg-zinc-900/40 border-emerald-500/10 dark:border-emerald-500/20 text-zinc-400 dark:text-zinc-500' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 hover:border-emerald-500/50 dark:hover:border-zinc-700 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-[15px] leading-tight ${task.completed ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </span>
                      {task.priority === 'high' && !task.completed && (
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" title={t.high_priority} />
                      )}
                    </div>
                    {task.description && (
                      <span className={`text-xs leading-relaxed ${task.completed ? 'opacity-40' : 'text-zinc-500'}`}>
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={(e) => handleFocusClick(e, task)}
                      className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all opacity-0 group-hover/card:opacity-100 flex items-center justify-center"
                      title={t.focus_mode}
                    >
                      <PlayCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleEditClick(e, task)}
                    className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all opacity-0 group-hover/card:opacity-100 flex items-center justify-center"
                    aria-label="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  {task.notes && (
                    <button 
                      onClick={(e) => toggleNotes(e, task.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        expandedNotes[task.id] ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <StickyNote className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {task.notes && expandedNotes[task.id] && (
                <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/50 dark:text-emerald-400/50">{t.personal_notes_label}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                    {task.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutineBlockView;
