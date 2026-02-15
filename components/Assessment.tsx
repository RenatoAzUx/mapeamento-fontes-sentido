
import React, { useState, useEffect } from 'react';
import { Question, Scores } from '../types';
import { QUESTIONS, DIMENSIONS } from '../constants';
import { MicroBreak } from './MicroBreak';

interface Props {
  onComplete: (scores: Scores) => void;
  onProgress: (answers: Record<number, number>, index: number) => void;
  initialAnswers?: Record<number, number>;
  initialIndex?: number;
  questionsOrder: number[]; // Recebe a ordem dos índices de QUESTIONS
}

export const Assessment: React.FC<Props> = ({ 
  onComplete, 
  onProgress, 
  initialAnswers = {}, 
  initialIndex = 0,
  questionsOrder 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [showBreak, setShowBreak] = useState(false);
  const [breakStep, setBreakStep] = useState(0);

  // Fallback para ordem sequencial caso por algum motivo a ordem não chegue
  const effectiveOrder = questionsOrder.length > 0 
    ? questionsOrder 
    : Array.from({ length: QUESTIONS.length }, (_, i) => i);

  const currentQuestion = QUESTIONS[effectiveOrder[currentIndex]];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    onProgress(answers, currentIndex);
  }, [answers, currentIndex]);

  const handleSelect = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    const questionNumber = currentIndex + 1;
    
    if (questionNumber === 39) {
      setBreakStep(0);
      setShowBreak(true);
    } else if (questionNumber === 75) {
      setBreakStep(1);
      setShowBreak(true);
    } else if (questionNumber === 101) {
      setBreakStep(2);
      setShowBreak(true);
    } else if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateAndFinish(newAnswers);
    }
  };

  const handleContinueFromBreak = () => {
    setShowBreak(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateAndFinish(answers);
    }
  };

  const calculateAndFinish = (finalAnswers: Record<number, number>) => {
    const sourceScores: Record<string, number> = {};
    const dimensionScores: Record<string, number> = {};

    QUESTIONS.forEach(q => {
      const val = finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : 0;
      sourceScores[q.sourceCode] = (sourceScores[q.sourceCode] || 0) + val;
    });

    DIMENSIONS.forEach(d => {
      dimensionScores[d.code] = d.sources.reduce((acc, src) => acc + (sourceScores[src.code] || 0), 0);
    });

    const totalRaw = Object.values(finalAnswers).reduce((a, b) => a + b, 0);

    onComplete({
      sources: sourceScores,
      dimensions: dimensionScores,
      globalScore: totalRaw
    });
  };

  return (
    <div className="p-8 sm:p-12 min-h-[500px] flex flex-col relative">
      {showBreak && (
        <MicroBreak step={breakStep} onContinue={handleContinueFromBreak} />
      )}

      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">
            Item {currentIndex + 1}
          </span>
          <span className="text-xs font-medium text-amber-900/40">
            Progresso: {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
          <div 
            className="gold-gradient h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center text-center">
        <h2 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-12 leading-tight px-4 italic serif">
          "{currentQuestion.text}"
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
          {[0, 1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleSelect(val)}
              className={`group flex flex-col items-center p-5 rounded-2xl border-2 transition-all transform hover:scale-105 shadow-sm hover:shadow-md ${
                answers[currentQuestion.id] === val 
                  ? 'border-amber-600 bg-amber-50 shadow-inner scale-105' 
                  : 'border-amber-50 hover:border-amber-400 hover:bg-amber-50/50'
              }`}
            >
              <span className={`text-3xl font-black mb-1 ${
                answers[currentQuestion.id] === val ? 'text-amber-700' : 'text-amber-900/30 group-hover:text-amber-700'
              }`}>{val}</span>
              <span className={`text-[9px] uppercase font-black tracking-tighter ${
                answers[currentQuestion.id] === val ? 'text-amber-500' : 'text-amber-900/20 group-hover:text-amber-500'
              }`}>
                {val === 0 ? 'Discordo' : val === 5 ? 'Concordo' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-amber-50 flex justify-between items-center text-amber-900/30 text-xs font-bold uppercase tracking-widest">
        <button 
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="hover:text-amber-700 transition disabled:opacity-30 flex items-center"
        >
          <i className="fas fa-chevron-left mr-2"></i> Anterior
        </button>
        <span className="hidden sm:inline">A sabedoria reside na sua sinceridade.</span>
      </div>
    </div>
  );
};
