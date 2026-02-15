
import { AssessmentResult } from '../types';
import { generateFeedback } from '../services/gemini';
import { sendResultToAdmin } from '../services/notifications';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DIMENSIONS_MAP } from '../constants';
import React, { useEffect, useState, useCallback, useRef } from 'react';

interface Props {
  result: AssessmentResult;
  onReset: () => void;
}

export const ResultView: React.FC<Props> = ({ result, onReset }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isReadyForCharts, setIsReadyForCharts] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadyForCharts(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const processResults = useCallback(async () => {
    setLoading(true);
    setError(false);
    
    try {
      const text = await generateFeedback(result);
      
      if (text.startsWith("ERRO_API") || text.startsWith("ERRO_SISTEMA") || text.startsWith("Erro:")) {
        setError(true);
        setFeedback(text);
        setLoading(false);
        return;
      }
      
      setFeedback(text);
      setLoading(false);
      
      if (!synced) {
        setSyncing(true);
        sendResultToAdmin({ ...result, aiFeedback: text })
          .then(success => {
            setSynced(success);
            setSyncError(!success);
            setSyncing(false);
          })
          .catch(() => {
            setSyncError(true);
            setSyncing(false);
          });
      }
    } catch (err: any) {
      setError(true);
      setFeedback(`Erro fatal: ${err.message || "Falha na IA."}`);
      setLoading(false);
    }
  }, [result, synced]);

  useEffect(() => {
    processResults();
  }, [processResults, retryCount]);

  const dimensionData = DIMENSIONS_MAP.map(dim => ({
    name: dim.name,
    score: result.scores.dimensions[dim.code] || 0
  }));

  const sourceNameMap = DIMENSIONS_MAP.reduce((acc, dim) => {
    dim.sources.forEach(s => acc[s.code] = s.name);
    return acc;
  }, {} as Record<string, string>);

  const topSources = Object.entries(result.scores.sources)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([code, score]) => ({ name: sourceNameMap[code], score }));

  const classification = (() => {
    const s = result.scores.globalScore;
    if (s <= 135) return { label: 'Vazio existencial severo', color: 'text-rose-600' };
    if (s <= 270) return { label: 'Grande vazio existencial', color: 'text-rose-400' };
    if (s <= 405) return { label: 'Sentido moderadamente frágil', color: 'text-amber-600' };
    if (s <= 560) return { label: 'Sentido moderadamente fortalecido', color: 'text-emerald-600' };
    return { label: 'Sentido profundamente consolidado', color: 'text-amber-800' };
  })();

  const formatFeedback = (text: string) => {
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="mb-6 p-6 bg-rose-50 rounded-[2rem] border border-rose-100 shadow-sm">
            <i className="fas fa-exclamation-triangle text-rose-400 text-3xl mb-4"></i>
            <p className="text-rose-900 font-bold mb-2">Atenção ao Sistema</p>
            <p className="text-rose-800/60 text-[11px] leading-relaxed italic">{text}</p>
          </div>
          <button onClick={() => setRetryCount(prev => prev + 1)} className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition shadow-xl">
            Tentar Gerar Novamente
          </button>
        </div>
      );
    }

    return text.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => {
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-amber-900 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <p key={i} className="mb-6 leading-relaxed">{content}</p>;
    });
  };

  return (
    <div className="p-8 sm:p-12 space-y-12 bg-white animate-in fade-in duration-1000">
      <section className="text-center">
        <div className="inline-flex items-center space-x-2 mb-4 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100 no-print min-w-[160px] justify-center">
           {synced ? (
             <><i className="fas fa-check-circle text-emerald-500 text-xs"></i><span className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest">Relatório Salvo</span></>
           ) : syncing ? (
             <><div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-amber-900/60 uppercase tracking-widest">Sincronizando...</span></>
           ) : syncError ? (
             <><i className="fas fa-exclamation-circle text-rose-400 text-xs"></i><span className="text-[10px] font-black text-rose-900/40 uppercase tracking-widest">Acesso Offline</span></>
           ) : (
             <span className="text-[10px] font-black text-amber-900/30 uppercase tracking-widest">IA Conectada</span>
           )}
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2 serif">Seu Perfil de Sentido</h2>
        <p className="text-amber-900/40 font-medium italic">Análise de Vitalidade para {result.userInfo.name}</p>
        <div className="mt-8 relative inline-block">
          <svg className="w-48 h-48 filter drop-shadow-xl">
            <circle className="text-amber-50" strokeWidth="8" stroke="currentColor" fill="transparent" r="75" cx="96" cy="96" />
            <circle className="text-amber-500" strokeWidth="8" strokeDasharray={75 * 2 * Math.PI} strokeDashoffset={75 * 2 * Math.PI * (1 - result.scores.globalScore / 675)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="75" cx="96" cy="96" style={{ transition: 'stroke-dashoffset 2s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-amber-900 tracking-tighter">{result.scores.globalScore}</span>
            <span className="text-[10px] font-black text-amber-800/40 uppercase tracking-widest">de 675</span>
          </div>
        </div>
        <p className={`mt-6 text-2xl font-black tracking-tight ${classification.color}`}>{classification.label}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-amber-50/20 p-8 rounded-[2.5rem] border border-amber-100 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-black text-amber-900 mb-6 uppercase tracking-widest text-center">Dimensões</h3>
          <div className="flex-grow w-full relative" ref={chartContainerRef}>
            {isReadyForCharts && (
              <ResponsiveContainer width="99%" height={250}>
                <BarChart data={dimensionData} layout="vertical" margin={{ left: -10, right: 30 }}>
                  <XAxis type="number" hide domain={[0, 200]} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#92400e' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="score" fill="#b45309" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="bg-amber-50/20 p-8 rounded-[2.5rem] border border-amber-100 min-h-[350px]">
          <h3 className="text-lg font-black text-amber-900 mb-6 uppercase tracking-widest text-center">Âncoras Dominantes</h3>
          <ul className="space-y-4">
            {topSources.map((s) => (
              <li key={s.name} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-amber-50 shadow-sm">
                <span className="font-bold text-amber-900/80">{s.name}</span>
                <span className="bg-amber-100 text-amber-700 font-black px-4 py-1.5 rounded-full text-xs">{s.score}/25</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative group">
        <div className={`prose prose-amber max-w-none p-8 sm:p-16 rounded-[3rem] border shadow-inner relative overflow-hidden print:shadow-none print:border-amber-100 ${error ? 'bg-rose-50 border-rose-200' : 'bg-[#fdfcf0] border-amber-200'}`}>
          <div className="flex items-center justify-between mb-12 relative no-print">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 gold-shadow ${error ? 'bg-rose-600' : 'gold-gradient'} text-white`}>
                <i className={`fas ${error ? 'fa-exclamation' : 'fa-feather-pointed'} text-xl`}></i>
              </div>
              <h3 className={`text-3xl font-black m-0 serif ${error ? 'text-rose-950' : 'text-amber-950'}`}>
                {error ? 'Status da Geração' : 'Análise Existencial'}
              </h3>
            </div>
            {!error && !loading && (
              <button onClick={() => window.print()} className="px-6 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition shadow-lg flex items-center">
                <i className="fas fa-file-pdf mr-2"></i> Relatório PDF
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-600 border-t-transparent mb-6"></div>
              <p className="text-amber-800 font-bold uppercase tracking-widest text-sm text-center">Gerando Devolutiva Clínica...</p>
            </div>
          ) : (
            <>
              <div className={`leading-[1.8] font-medium text-lg relative serif px-4 sm:px-8 print:px-0 print:text-base ${error ? 'text-rose-900' : 'text-amber-950/90'}`}>
                {formatFeedback(feedback)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Nova Seção: Plano de Ação e Conexão */}
      {!loading && !error && (
        <section className="animate-in slide-in-from-bottom duration-1000 delay-300">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-amber-950 serif">Plano de Ação e Conexão</h3>
            <p className="text-amber-900/40 font-bold uppercase tracking-widest text-[10px] mt-2">Próximos Passos Obrigatórios</p>
          </div>
          
          <div className="space-y-6">
            {/* Card 1: WhatsApp */}
            <a 
              href="https://wa.me/5511998920790?text=Fiz%20meu%20mapeamento.%20Quero%20aplicar." 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-amber-50 hover:bg-white p-8 rounded-[2rem] border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-white text-3xl shrink-0 shadow-lg">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-black text-amber-950 uppercase tracking-tight mb-1">Mentoria de Alinhamento (WhatsApp)</h4>
                  <p className="text-amber-900/60 font-medium leading-relaxed">Sessão direta para transformar seus insights em avanços práticos e decifrar seus pontos cegos com minha orientação.</p>
                </div>
              </div>
            </a>

            {/* Card 2: Newsletter */}
            <a 
              href="https://mestresdamente.beehiiv.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-amber-50 hover:bg-white p-8 rounded-[2rem] border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-900 flex items-center justify-center text-amber-50 text-3xl shrink-0 shadow-lg">
                  <i className="fas fa-users"></i>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-black text-amber-950 uppercase tracking-tight mb-1">Comunidade Mestres da Mente (News)</h4>
                  <p className="text-amber-900/60 font-medium leading-relaxed">Ambiente de desenvolvimento constante lado a lado com outros líderes focados em alta performance existencial.</p>
                </div>
              </div>
            </a>

            {/* Card 3: Instagram */}
            <a 
              href="https://instagram.com/renatoli.on" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-white hover:bg-amber-50 p-8 rounded-[2rem] border-2 border-amber-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 rounded-2xl border-2 border-amber-600 flex items-center justify-center text-amber-600 text-3xl shrink-0 shadow-sm">
                  <i className="fab fa-instagram"></i>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-black text-amber-950 uppercase tracking-tight mb-1">Conexão Diária (Instagram)</h4>
                  <p className="text-amber-900/60 font-medium leading-relaxed">Acompanhe o fluxo diário de aplicação da neurociência e comportamento para manter sua clareza executiva.</p>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      <div className="text-center pt-8 no-print">
        <button onClick={onReset} className="text-amber-800/40 hover:text-amber-700 font-black uppercase tracking-widest text-[10px] transition underline decoration-dotted">
          Reiniciar Avaliação
        </button>
      </div>
    </div>
  );
};
