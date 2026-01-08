
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, RoutineBlock, Task, Habit, DailyCheckIn, AIInsight, Language, Theme } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RoutineBlockView from './components/RoutineBlockView';
import CheckInModal from './components/CheckInModal';
import AddTaskModal from './components/AddTaskModal';
import LiveMentor from './components/LiveMentor';
import FocusTimer from './components/FocusTimer';
import { getRoutineMentorship, getWeeklyReport, getStrategicAdvice } from './geminiService';
import { getT } from './translations';
import { Sparkles, TrendingUp, Brain, Mic } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const INITIAL_STATE: AppState = {
  tasks: [
    { id: '1', title: 'Meditação matinal', description: 'Focar na respiração por 10 minutos', notes: 'Tentar a técnica Box Breathing hoje.', completed: false, block: RoutineBlock.MORNING, isRecurrent: true, priority: 'medium' },
    { id: '2', title: 'Deep Work Session', description: 'Bloqueio de 2h sem distrações (Projeto X)', notes: 'Focar no módulo de autenticação.', completed: false, block: RoutineBlock.MORNING, priority: 'high' },
    { id: '3', title: 'Almoço saudável', description: 'Priorizar proteínas e vegetais verdes', completed: false, block: RoutineBlock.AFTERNOON, isRecurrent: true, priority: 'low' },
    { id: '4', title: 'Caminhada 30min', description: 'Ouvir podcast de psicologia comportamental', notes: 'Episódio sobre formação de hábitos do Huberman Lab.', completed: false, block: RoutineBlock.AFTERNOON, priority: 'medium' },
    { id: '5', title: 'Leitura antes de dormir', description: 'Mínimo 5 páginas de livro não-ficção', notes: 'Atualmente lendo: Atomic Habits.', completed: false, block: RoutineBlock.EVENING, isRecurrent: true, priority: 'medium' },
  ],
  habits: [
    { id: 'h1', name: 'Beber Água (2L)', streak: 12, color: 'text-sky-500 dark:text-sky-400', frequency: 'daily' },
    { id: 'h2', name: 'Exercício Físico', streak: 4, color: 'text-rose-500 dark:text-rose-400', frequency: 'daily' },
    { id: 'h3', name: 'Skincare', streak: 21, color: 'text-emerald-500 dark:text-emerald-400', frequency: 'daily' },
  ],
  checkIns: [],
  aiInsights: [],
  language: 'pt',
  theme: 'dark'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('dailyflow_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  
  const [activeTab, setActiveTab] = useState('routine');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [showLiveMentor, setShowLiveMentor] = useState(false);
  const [strategicAdvice, setStrategicAdvice] = useState<string | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ message: string; adjustment: string; microHabit: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const t = getT(state.language);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('dailyflow_state', JSON.stringify(state));
  }, [state]);

  const toggleLanguage = () => {
    setState(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'pt' : 'en'
    }));
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const editTask = (id: string, taskData: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...taskData } : t)
    }));
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      const task: Task = {
        ...taskData,
        id: Date.now().toString(),
        completed: false
      };
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
      setShowAddTask(false);
    }
  };

  const handleCheckIn = async (checkIn: DailyCheckIn) => {
    setState(prev => ({
      ...prev,
      checkIns: [...prev.checkIns, checkIn]
    }));
    setShowCheckIn(false);
    
    setIsLoadingAi(true);
    const mentorship = await getRoutineMentorship(state, checkIn, state.language);
    setAiResponse(mentorship);
    setIsLoadingAi(false);
  };

  const generateStrategy = async () => {
    setIsGeneratingStrategy(true);
    const advice = await getStrategicAdvice(state, state.language);
    setStrategicAdvice(advice);
    setIsGeneratingStrategy(false);
  };

  const fetchInsights = useCallback(async () => {
    if (state.aiInsights.length > 0) return;
    setIsLoadingAi(true);
    const insights = await getWeeklyReport(state, state.language);
    setState(prev => ({ ...prev, aiInsights: insights }));
    setIsLoadingAi(false);
  }, [state.aiInsights.length, state.language, state]);

  useEffect(() => {
    if (activeTab === 'insights') {
      fetchInsights();
    }
  }, [activeTab, fetchInsights]);

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-zinc-50 dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-900 shadow-2xl relative transition-colors">
      <Header 
        language={state.language} 
        onLanguageToggle={toggleLanguage} 
        theme={state.theme} 
        onThemeToggle={toggleTheme} 
      />

      <main className="px-6 py-4 space-y-8 animate-in fade-in duration-500">
        
        {/* Voice Mentor Floating Trigger */}
        <button 
          onClick={() => setShowLiveMentor(true)}
          className="fixed bottom-24 right-6 z-40 bg-emerald-500 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <Mic className="w-6 h-6 text-white group-hover:animate-pulse" />
        </button>

        {/* AI Mentor Card */}
        {activeTab === 'routine' && (
          <div className="bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 dark:from-emerald-500/10 dark:to-indigo-500/10 rounded-3xl p-6 border border-emerald-500/10 dark:border-emerald-500/20 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-20 h-20 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-md text-[10px] font-black uppercase tracking-tighter text-emerald-600 dark:text-emerald-400">{t.mentor_latency}</div>
                <h2 className="font-bold text-lg text-zinc-800 dark:text-emerald-100">{t.mentor_title}</h2>
              </div>
              {isLoadingAi ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>
              ) : aiResponse ? (
                <div className="space-y-4">
                  <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed italic">"{aiResponse.message}"</p>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400/70">{state.language === 'pt' ? 'Ajuste Sugerido' : 'Suggested Adjustment'}</span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-black/40 p-3 rounded-xl border border-zinc-200 dark:border-white/5">{aiResponse.adjustment}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-300">{t.mentor_ready}</p>
                  <button 
                    onClick={() => setShowCheckIn(true)}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600"
                  >
                    {t.check_in_btn}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Routine Tab */}
        {activeTab === 'routine' && (
          <div className="space-y-8">
            <RoutineBlockView 
              block={RoutineBlock.MORNING} 
              tasks={state.tasks.filter(t => t.block === RoutineBlock.MORNING)} 
              onToggleTask={toggleTask}
              onEditTask={setEditingTask}
              onFocusTask={setFocusTask}
              language={state.language}
            />
            <RoutineBlockView 
              block={RoutineBlock.AFTERNOON} 
              tasks={state.tasks.filter(t => t.block === RoutineBlock.AFTERNOON)} 
              onToggleTask={toggleTask}
              onEditTask={setEditingTask}
              onFocusTask={setFocusTask}
              language={state.language}
            />
            <RoutineBlockView 
              block={RoutineBlock.EVENING} 
              tasks={state.tasks.filter(t => t.block === RoutineBlock.EVENING)} 
              onToggleTask={toggleTask}
              onEditTask={setEditingTask}
              onFocusTask={setFocusTask}
              language={state.language}
            />
          </div>
        )}

        {/* Habits Tab */}
        {activeTab === 'habits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">{t.consistency}</h2>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-sm font-bold">
                <TrendingUp className="w-4 h-4" />
                +12% {t.this_month}
              </div>
            </div>
            <div className="grid gap-4">
              {state.habits.map(habit => (
                <div key={habit.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl flex items-center justify-between group hover:border-emerald-500/50 dark:hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 ${habit.color}`}>
                       <span className="text-xl font-bold">{habit.streak}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">{habit.name}</h3>
                      <p className="text-xs text-zinc-500">{t.last_done}</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all">
                    <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full group-hover:bg-white"></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights & Strategy Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white">{t.deep_analysis}</h2>
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-[32px] p-6 border border-indigo-500/10 dark:border-indigo-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800 dark:text-indigo-100 leading-tight">{t.strategic_mentor}</h3>
                  <p className="text-[10px] text-indigo-600/60 dark:text-indigo-400/60 font-bold uppercase tracking-widest">{t.thinking_mode}</p>
                </div>
              </div>

              {strategicAdvice ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap bg-white/50 dark:bg-zinc-950/50 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 italic">
                    {strategicAdvice}
                  </div>
                  <button 
                    onClick={() => setStrategicAdvice(null)}
                    className="text-xs text-zinc-500 font-bold uppercase tracking-widest hover:text-indigo-600"
                  >
                    {state.language === 'pt' ? 'Gerar nova análise estratégica' : 'Generate new strategic analysis'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {t.strategy_desc}
                  </p>
                  <button 
                    onClick={generateStrategy}
                    disabled={isGeneratingStrategy}
                    className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isGeneratingStrategy ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {t.thinking}</>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> {t.start_analysis}</>
                    )}
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-12 text-zinc-800 dark:text-white">{t.trends}</h2>
            <div className="h-48 w-full bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-800">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: state.language === 'pt' ? 'Seg' : 'Mon', val: 400 }, 
                  { name: state.language === 'pt' ? 'Ter' : 'Tue', val: 300 }, 
                  { name: state.language === 'pt' ? 'Qua' : 'Wed', val: 600 },
                  { name: state.language === 'pt' ? 'Qui' : 'Thu', val: 800 }, 
                  { name: state.language === 'pt' ? 'Sex' : 'Fri', val: 500 }, 
                  { name: state.language === 'pt' ? 'Sab' : 'Sat', val: 900 }, 
                  { name: state.language === 'pt' ? 'Dom' : 'Sun', val: 700 },
                ]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      {showCheckIn && <CheckInModal onClose={() => setShowCheckIn(false)} onSave={handleCheckIn} language={state.language} />}
      {(showAddTask || editingTask) && (
        <AddTaskModal 
          onClose={() => { setShowAddTask(false); setEditingTask(null); }} 
          onSave={handleSaveTask} 
          initialData={editingTask}
          language={state.language}
        />
      )}
      {showLiveMentor && <LiveMentor onClose={() => setShowLiveMentor(false)} language={state.language} />}
      {focusTask && <FocusTimer task={focusTask} onClose={() => setFocusTask(null)} language={state.language} />}
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setShowAddTask(true)} language={state.language} />
    </div>
  );
};

export default App;
