
import React from 'react';

interface Props {
  step: number;
  onContinue: () => void;
}

export const MicroBreak: React.FC<Props> = ({ step, onContinue }) => {
  const phrases = [
    "Continue. Clareza está sendo construída.",
    "A honestidade aqui é um presente para você.",
    "Respire, você já avançou mais do que imagina."
  ];

  const phrase = phrases[step] || phrases[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
      <div className="max-w-md w-full space-y-12">
        {/* Animação de respiração suave */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full border border-amber-500/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full gold-gradient opacity-20 animate-ping"></div>
              <div className="absolute w-12 h-12 rounded-full gold-gradient shadow-[0_0_20px_rgba(212,175,55,0.4)]"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-2xl sm:text-3xl font-light text-amber-50 italic leading-relaxed serif">
            "{phrase}"
          </p>
          <div className="h-0.5 w-12 gold-gradient mx-auto rounded-full opacity-50"></div>
        </div>

        <button
          onClick={onContinue}
          className="px-12 py-4 rounded-2xl border border-amber-500/30 text-amber-500 font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-500 hover:text-white transition-all duration-500 group"
        >
          Continuar <i className="fas fa-chevron-right ml-2 group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};
