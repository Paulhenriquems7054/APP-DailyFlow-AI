
export enum RoutineBlock {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening'
}

export type Language = 'en' | 'pt';
export type Theme = 'light' | 'dark';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  completed: boolean;
  block: RoutineBlock;
  isRecurrent?: boolean;
  priority?: Priority;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted?: string;
  color: string;
  frequency: 'daily' | 'weekly';
  linkedTaskId?: string; // Para Habit Stacking
}

export interface DailyCheckIn {
  date: string;
  energy: 1 | 2 | 3; // Low, Mid, High
  mood: 1 | 2 | 3;   // Low, Mid, High
  note?: string;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'motivational' | 'adjustment' | 'progress';
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  checkIns: DailyCheckIn[];
  aiInsights: AIInsight[];
  language: Language;
  theme: Theme;
}
