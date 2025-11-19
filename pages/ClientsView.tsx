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
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Клієнти</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-purple-200">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
            type="text" 
            placeholder="Пошук клієнта..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredClients.map(client => (
            <div 
                key={client.id} 
                onClick={() => setSelectedClient(client === selectedClient ? null : client)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-4">
                    <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{client.name}</h3>
                        <p className="text-sm text-slate-500">{client.phone}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${selectedClient?.id === client.id ? 'rotate-90' : ''}`} />
                </div>

                {selectedClient?.id === client.id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <Calendar className="w-3 h-3" /> Останній візит
                                </div>
                                <span className="font-medium text-slate-900">{client.lastVisit}</span>
                            </div>
                             <div className="bg-slate-50 p-3 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <Phone className="w-3 h-3" /> Контакт
                                </div>
                                <a href={`tel:${client.phone}`} className="font-medium text-purple-600">{client.phone}</a>
                            </div>
                         </div>
                         <div className="bg-yellow-50 p-3 rounded-xl text-yellow-800 border border-yellow-100">
                            <span className="font-bold block mb-1 text-xs uppercase tracking-wider">Нотатки</span>
                            {client.notes}
                         </div>
                         <div className="mt-4 flex gap-2">
                            <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-medium">Історія</button>
                            <button className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50">Редагувати</button>
                         </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};