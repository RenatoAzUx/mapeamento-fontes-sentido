
import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';

interface Props {
  onSubmit: (info: UserInfo) => void;
  initialData: UserInfo | null;
}

export const UserInfoForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    contact: initialData?.contact || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-8 sm:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Antes de começarmos...</h2>
        <p className="text-gray-600 leading-relaxed">
          Para fornecer um relatório personalizado, precisamos de alguns detalhes básicos. 
          Sua privacidade é importante; esses dados são usados apenas para contextualizar seus resultados.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-amber-900/70 mb-1">Nome Completo</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50/10"
            placeholder="Ex: Maria Silva"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-amber-900/70 mb-1">E-mail</label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50/10"
            placeholder="maria@exemplo.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-amber-900/70 mb-1">WhatsApp / Telefone (Opcional)</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition bg-amber-50/10"
            placeholder="(11) 99999-9999"
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full gold-gradient hover:opacity-90 text-white font-bold py-4 rounded-xl gold-shadow transform transition hover:-translate-y-1"
        >
          {initialData ? 'Continuar Avaliação' : 'Iniciar Avaliação'} <i className="fas fa-arrow-right ml-2"></i>
        </button>
      </form>
    </div>
  );
};
