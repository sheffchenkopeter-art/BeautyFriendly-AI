import React, { useState } from 'react';
import { Search, Phone, Calendar, ChevronRight, Plus } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';

export const ClientsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-6 pb-20 md:pb-8">
       <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-4">
        <h2 className="text-2xl font-serif text-white">База Клієнтів</h2>
        <button className="bg-[#d6b980] hover:bg-[#c2a56a] text-[#101b2a] w-10 h-10 rounded flex items-center justify-center transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
            type="text" 
            placeholder="Пошук..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1a2736] border border-[#2a3c52] rounded text-white focus:outline-none focus:border-[#d6b980] transition-colors placeholder:text-slate-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredClients.map(client => (
            <div 
                key={client.id} 
                onClick={() => setSelectedClient(client === selectedClient ? null : client)}
                className={`bg-[#1a2736] p-4 rounded border transition-all cursor-pointer ${
                    selectedClient?.id === client.id 
                    ? 'border-[#d6b980] shadow-lg' 
                    : 'border-[#2a3c52] hover:border-slate-600'
                }`}
            >
                <div className="flex items-center gap-4">
                    <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-[#2a3c52]" />
                    <div className="flex-1">
                        <h3 className="font-serif text-lg text-white">{client.name}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{client.phone}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${selectedClient?.id === client.id ? 'rotate-90 text-[#d6b980]' : ''}`} />
                </div>

                {selectedClient?.id === client.id && (
                    <div className="mt-4 pt-4 border-t border-[#2a3c52] text-sm animate-in fade-in slide-in-from-top-2">
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-[#101b2a] p-3 rounded border border-[#2a3c52]">
                                <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase">
                                    <Calendar className="w-3 h-3" /> Останній візит
                                </div>
                                <span className="font-serif text-white">{client.lastVisit}</span>
                            </div>
                             <div className="bg-[#101b2a] p-3 rounded border border-[#2a3c52]">
                                <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase">
                                    <Phone className="w-3 h-3" /> Контакт
                                </div>
                                <a href={`tel:${client.phone}`} className="text-[#d6b980] hover:underline">{client.phone}</a>
                            </div>
                         </div>
                         <div className="bg-[#2a3c52]/30 p-3 rounded border border-[#2a3c52] text-slate-300">
                            <span className="text-[#d6b980] text-[10px] uppercase font-bold block mb-1">Нотатки</span>
                            <p className="font-light italic">{client.notes}</p>
                         </div>
                         <div className="mt-4 flex gap-3">
                            <button className="flex-1 bg-[#d6b980] text-[#101b2a] py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#c2a56a]">Історія</button>
                            <button className="flex-1 border border-[#2a3c52] text-slate-400 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#2a3c52] hover:text-white">Редагувати</button>
                         </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};