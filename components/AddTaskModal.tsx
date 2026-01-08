
import React, { useState, useEffect } from 'react';
import { X, Plus, Sun, Cloud, Moon, Save, RotateCcw } from 'lucide-react';
import { RoutineBlock, Task, Language } from '../types';
import { getT } from '../translations';

interface AddTaskModalProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  initialData?: Task | null;
  language: Language;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onSave, initialData, language }) => {
  const t = getT(language);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [block, setBlock] = useState<RoutineBlock>(initialData?.block || RoutineBlock.MORNING);
  const [isRecurrent, setIsRecurrent] = useState(initialData?.isRecurrent || false);

  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      title,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      block,
      isRecurrent
    });
  };

  const blocks = [
    { id: RoutineBlock.MORNING, icon: Sun, label: t.morning },
    { id: RoutineBlock.AFTERNOON, icon: Cloud, label: t.afternoon },
    { id: RoutineBlock.EVENING, icon: Moon, label: t.evening },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-zinc-950/40 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{isEditing ? t.edit_task : t.new_task}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.title_label}</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.time_label}</label>
            <div className="grid grid-cols-3 gap-2">
              {blocks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBlock(item.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${
                    block === item.id 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isRecurrent ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}`}>
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{t.recur_label}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-tight">Daily Habit</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRecurrent(!isRecurrent)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isRecurrent ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <span
                className={`${
                  isRecurrent ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.desc_label}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t.notes_label}</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`w-full ${isEditing ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 shadow-emerald-600/20'} text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg mt-4 flex items-center justify-center gap-2`}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? t.update_task : t.create_task}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
