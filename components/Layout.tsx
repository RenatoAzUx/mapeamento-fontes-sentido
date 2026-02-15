
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
      <header className="mb-10 text-center w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Efeito de brilho dourado ao redor do logo */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Container da Bússola */}
            <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full border-2 border-amber-100 shadow-xl shadow-amber-900/5">
              <div className="w-24 h-24 rounded-full border border-amber-50 flex items-center justify-center bg-amber-50/30">
                <i className="fas fa-compass text-6xl text-amber-600 transform group-hover:rotate-12 transition-transform duration-500"></i>
              </div>
              
              {/* Detalhes ornamentais da bússola */}
              <div className="absolute inset-0 border-4 border-double border-amber-200/30 rounded-full pointer-events-none"></div>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">Mapeamento Fontes de Sentido</h1>
        <p className="text-amber-800 text-lg italic opacity-80">Descubra a arquitetura da sua plenitude.</p>
      </header>
      <main className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-amber-900/5 overflow-hidden border border-amber-100">
        {children}
      </main>
      <footer className="mt-12 text-amber-900/40 text-sm font-medium">
        &copy; {new Date().getFullYear()} Avaliação Mapeamento Fontes de Sentido. Esta não é uma ferramenta de diagnóstico.
      </footer>
    </div>
  );
};