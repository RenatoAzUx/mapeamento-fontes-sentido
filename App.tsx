
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserInfoForm } from './components/UserInfoForm';
import { Introduction } from './components/Introduction';
import { Assessment } from './components/Assessment';
import { ResultView } from './components/ResultView';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { AppState, UserInfo, Scores, AssessmentResult } from './types';
import { QUESTIONS, SOURCE_ACTS } from './constants';

const STORAGE_KEY = 'mapeamento_sentido_v1_save';

// Função utilitária para embaralhar um array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Lógica interna: Geração de ordem baseada na Curva Emocional (Atos 1, 2, 3)
const generateEmotionalOrder = () => {
  const act1Indices: number[] = [];
  const act2Indices: number[] = [];
  const act3Indices: number[] = [];

  QUESTIONS.forEach((q, index) => {
    const act = SOURCE_ACTS[q.sourceCode] || 1;
    if (act === 1) act1Indices.push(index);
    else if (act === 2) act2Indices.push(index);
    else act3Indices.push(index);
  });

  return [
    ...shuffleArray(act1Indices),
    ...shuffleArray(act2Indices),
    ...shuffleArray(act3Indices)
  ];
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<number, number>>({});
  const [savedIndex, setSavedIndex] = useState(0);
  const [questionsOrder, setQuestionsOrder] = useState<number[]>([]);

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.userInfo) setUserInfo(parsed.userInfo);
        if (parsed.result) setResult(parsed.result);
        if (parsed.answers) setSavedAnswers(parsed.answers);
        if (parsed.index) setSavedIndex(parsed.index);
        if (parsed.order) setQuestionsOrder(parsed.order);
        
        if (parsed.state === AppState.RESULTS && parsed.result) {
          setState(AppState.RESULTS);
        } else if (parsed.state === AppState.ASSESSMENT) {
          setState(AppState.ASSESSMENT);
        } else {
          setState(parsed.state || AppState.WELCOME);
        }
      } catch (e) {
        console.error("Erro ao carregar cache local", e);
      }
    }
  }, []);

  // Salva dados sempre que houver mudança relevante
  useEffect(() => {
    const dataToSave = {
      state,
      userInfo,
      result,
      answers: savedAnswers,
      index: savedIndex,
      order: questionsOrder
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [state, userInfo, result, savedAnswers, savedIndex, questionsOrder]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state]);

  const handleStart = () => {
    setState(AppState.INTRO);
  };

  const handleIntroComplete = () => {
    setState(AppState.USER_INFO);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    if (questionsOrder.length === 0) {
      setQuestionsOrder(generateEmotionalOrder());
    }
    setState(AppState.ASSESSMENT);
  };

  const handleProgressUpdate = (answers: Record<number, number>, index: number) => {
    setSavedAnswers(answers);
    setSavedIndex(index);
  };

  const handleAssessmentComplete = (scores: Scores) => {
    if (userInfo) {
      const newResult = { userInfo, scores };
      setResult(newResult);
      setState(AppState.CALCULATING);
      setTimeout(() => {
        setState(AppState.RESULTS);
      }, 4000);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const renderContent = () => {
    switch (state) {
      case AppState.WELCOME:
        return (
          <div className="p-8 sm:p-16 text-center animate-in fade-in duration-700">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 serif">Descubra o que Realmente Importa</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              O sentido de vida é a principal força motivadora na jornada humana. Esta avaliação abrangente mapeia suas fontes únicas de sentido através de dimensões psicológicas fundamentais.
            </p>
            {userInfo && (
              <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100 inline-block">
                <p className="text-amber-900 text-sm">Olá, <strong>{userInfo.name}</strong>! Vimos que você já iniciou.</p>
                <button 
                   onClick={() => setState(AppState.ASSESSMENT)}
                   className="text-amber-600 font-bold text-xs uppercase underline mt-2 hover:text-amber-800"
                >
                  Continuar de onde parei
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
                <i className="fas fa-check-circle text-amber-600 mb-3 text-xl"></i>
                <p className="text-sm font-bold text-gray-800">Cientificamente Embasado</p>
                <p className="text-xs text-amber-800/60 mt-1">Baseado em modelos validados de sentido de vida.</p>
              </div>
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
                <i className="fas fa-fingerprint text-amber-600 mb-3 text-xl"></i>
                <p className="text-sm font-bold text-gray-800">Mapeamento Único</p>
                <p className="text-xs text-amber-800/60 mt-1">Uma ferramenta para clareza sobre suas motivações internas.</p>
              </div>
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
                <i className="fas fa-scroll text-amber-600 mb-3 text-xl"></i>
                <p className="text-sm font-bold text-gray-800">Relatório Personalizado</p>
                <p className="text-xs text-amber-800/60 mt-1">Receba sua análise existencial logo após o término.</p>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="gold-gradient hover:opacity-90 text-white font-bold py-5 px-12 rounded-2xl gold-shadow transform transition hover:-translate-y-1 text-lg"
            >
              Iniciar Minha Jornada
            </button>
            <p className="mt-8 text-sm text-amber-900/40 font-semibold tracking-wide uppercase">Duração estimada: 15 minutos.</p>
          </div>
        );
      
      case AppState.INTRO:
        return <Introduction onContinue={handleIntroComplete} />;
      
      case AppState.USER_INFO:
        return <UserInfoForm onSubmit={handleUserInfoSubmit} initialData={userInfo} />;
      
      case AppState.ASSESSMENT:
        return (
          <Assessment 
            onComplete={handleAssessmentComplete} 
            onProgress={handleProgressUpdate}
            initialAnswers={savedAnswers}
            initialIndex={savedIndex}
            questionsOrder={questionsOrder}
          />
        );
      
      case AppState.CALCULATING:
        return <LoadingAnalysis />;
      
      case AppState.RESULTS:
        return result ? <ResultView result={result} onReset={handleReset} /> : null;
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;
