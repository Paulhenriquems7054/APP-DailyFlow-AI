
import React, { useState } from 'react';
import { X, Zap, Smile } from 'lucide-react';
import { DailyCheckIn, Language } from '../types';
import { getT } from '../translations';

interface CheckInModalProps {
  onClose: () => void;
  onSave: (checkIn: DailyCheckIn) => void;
  language: Language;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ onClose, onSave, language }) => {
  const t = getT(language);
  const [energy, setEnergy] = useState<1 | 2 | 3>(2);
  const [mood, setMood] = useState<1 | 2 | 3>(2);

  const handleSubmit = () => {
    onSave({
      date: new Date().toISOString(),
      energy,
      mood
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{t.how_are_you}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
            <X className="w-6 h-6 text-zinc-500" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Energy Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{t.energy_level}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => setEnergy(val as 1|2|3)}
                  className={`py-4 rounded-2xl border transition-all ${
                    energy === val 
                      ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {val === 1 ? t.energy_low : val === 2 ? t.energy_mid : t.energy_high}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold">{t.current_mood}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => setMood(val as 1|2|3)}
                  className={`py-4 rounded-2xl border transition-all ${
                    mood === val 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {val === 1 ? t.mood_moody : val === 2 ? t.mood_neutral : t.mood_great}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-500 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95 mt-4"
          >
            {t.start_day}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
