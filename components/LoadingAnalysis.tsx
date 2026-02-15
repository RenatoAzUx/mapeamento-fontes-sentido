
import React, { useState, useEffect } from 'react';

export const LoadingAnalysis: React.FC = () => {
  const [step, setStep] = useState(0);
  const messages = [
    "Sistematizando suas respostas...",
    "Mapeando dimensões de Autoatualização e Transcendência...",
    "Correlacionando fontes de Ordem e Bem-estar...",
    "Iniciando análise existencial profunda...",
    "Quase pronto. A arquitetura da sua plenitude está emergindo."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-12 sm:p-24 flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-amber-200 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-brain text-amber-600 text-2xl animate-bounce"></i>
        </div>
      </div>
      
      <h3 className="text-xl font-black text-amber-900 mb-2 uppercase tracking-[0.2em]">Gerando Devolutiva...</h3>
      <p className="text-amber-800/40 font-black text-[10px] uppercase tracking-widest mb-8">
        Gerando insights para seu mapa existencial com terapeuta de IA treinado
      </p>

      <div className="h-6 transition-all duration-500 italic text-amber-900/60 font-medium text-sm">
        {messages[step]}
      </div>
      
      <div className="mt-12 w-64 bg-amber-50 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full gold-gradient transition-all duration-1000 ease-linear"
          style={{ width: `${((step + 1) / messages.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
