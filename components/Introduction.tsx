
import React from 'react';

interface Props {
  onContinue: () => void;
}

export const Introduction: React.FC<Props> = ({ onContinue }) => {
  return (
    <div className="p-8 sm:p-12 max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Mensagem do Renato */}
        <div className="relative p-8 bg-amber-50/30 rounded-[2rem] border border-amber-100 shadow-inner">
          <div className="absolute -top-4 -left-4 w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
            👋
          </div>
          <div className="space-y-4 text-gray-800 leading-relaxed">
            <p className="text-xl font-bold italic serif">Oi, aqui é o Renato Azarias.</p>
            <p>
              Este é um teste sério e profundo, baseado nas pesquisas da psicóloga alemã <strong>Dra. Tatjana Schnell</strong>.
            </p>
            <p>
              Investigaremos até que ponto sua vida está conectada a um verdadeiro sentido.
            </p>
            <p>
              Ele pode revelar se você está vivendo com propósito… ou se existe um risco de <strong>vazio existencial</strong>, 
              que muitas vezes se manifesta como ansiedade, bloqueios, desânimo, procrastinação ou sensação de estar “perdido(a)”.
            </p>
            <p className="flex items-center text-amber-900 font-semibold">
              <span className="mr-2 text-2xl">🧭</span>
              Em apenas 10 minutos, você terá um mapa claro de como anda seu nível de sentido nas principais áreas da vida.
            </p>
          </div>
        </div>

        {/* Instruções */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wider text-sm">Instruções importantes:</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <p className="text-gray-600 mb-4">
              Para cada afirmação, escolha uma resposta de <strong>0 a 5</strong>, conforme o quanto ela é verdadeira para você no momento atual da sua vida (baseie-se nos últimos 6 meses).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold uppercase tracking-tight">
              {[
                { val: 0, label: "Discordo totalmente" },
                { val: 1, label: "Discordo parcialmente" },
                { val: 2, label: "Levemente em desacordo" },
                { val: 3, label: "Levemente de acordo" },
                { val: 4, label: "Concordo parcialmente" },
                { val: 5, label: "Concordo totalmente" }
              ].map((item) => (
                <div key={item.val} className="flex items-center p-3 bg-white border border-amber-50 rounded-xl">
                  <span className="w-6 h-6 rounded-lg gold-gradient text-white flex items-center justify-center mr-3 text-[10px]">{item.val}</span>
                  <span className="text-amber-900/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center italic text-gray-500 py-4 border-t border-amber-50 mt-6">
            Não há certo ou errado. Apenas seja honesto(a) com o que sente hoje.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full gold-gradient hover:opacity-90 text-white font-black py-5 rounded-2xl gold-shadow transform transition hover:-translate-y-1 text-lg flex items-center justify-center"
        >
          Prosseguir para Identificação <i className="fas fa-arrow-right ml-3"></i>
        </button>
      </div>
    </div>
  );
};
