
import React, { useState } from 'react';
import { Scissors, Plus, X, Save, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesViewProps {
    services: ServiceItem[];
    onAddService: (service: ServiceItem) => void;
    onUpdateService: (service: ServiceItem) => void;
    onDeleteService: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ services, onAddService, onUpdateService, onDeleteService }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');

    const openModal = (service?: ServiceItem) => {
        if (service) {
            setEditingService(service);
            setTitle(service.title);
            setPrice(service.price.toString());
            setDuration(service.duration.toString());
            setDescription(service.description || '');
        } else {
            setEditingService(null);
            setTitle('');
            setPrice('');
            setDuration('60');
            setDescription('');
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newService: ServiceItem = {
            id: editingService ? editingService.id : Date.now().toString(),
            title,
            price: parseInt(price),
            duration: parseInt(duration),
            description
        };

        if (editingService) {
            onUpdateService(newService);
        } else {
            onAddService(newService);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-6 pb-20 md:pb-8 relative">
            <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-4">
                <h2 className="text-2xl font-serif text-white">Прайс-лист Послуг</h2>
                <button 
                    onClick={() => openModal()}
                    className="bg-[#d6b980] hover:bg-[#c2a56a] text-[#101b2a] px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(214,185,128,0.3)] transition-all"
                >
                    <Plus className="w-4 h-4" /> <span className="hidden md:inline">Додати послугу</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                    <div key={service.id} className="bg-[#1a2736] rounded border border-[#2a3c52] p-5 hover:border-[#d6b980] transition-all group relative">
                         <div className="flex justify-between items-start mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#101b2a] border border-[#d6b980]/30 flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-[#d6b980]" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openModal(service)}
                                    className="p-2 bg-[#101b2a] rounded hover:text-[#d6b980] text-slate-400 border border-[#2a3c52] hover:border-[#d6b980]"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button 
                                    onClick={() => onDeleteService(service.id)}
                                    className="p-2 bg-[#101b2a] rounded hover:text-red-400 text-slate-400 border border-[#2a3c52] hover:border-red-900"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                         </div>

                         <h3 className="text-lg font-serif text-white mb-1">{service.title}</h3>
                         <p className="text-slate-500 text-xs mb-4 h-8 overflow-hidden">{service.description || 'Без опису'}</p>

                         <div className="flex items-center justify-between pt-4 border-t border-[#2a3c52]">
                            <div className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                                <Clock className="w-3.5 h-3.5 text-[#d6b980]" />
                                {service.duration} хв
                            </div>
                            <div className="flex items-center gap-1 text-[#d6b980] font-bold text-lg">
                                ₴{service.price}
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
                    <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif text-white">{editingService ? 'Редагування послуги' : 'Нова послуга'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Назва послуги</label>
                                <input 
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Наприклад: Жіноча стрижка"
                                    className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                                />
                            </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Ціна (₴)</label>
                                    <input 
                                        type="number"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Тривалість (хв)</label>
                                    <input 
                                        type="number"
                                        required
                                        step="15"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Опис</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Короткий опис послуги..."
                                    className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none h-24 resize-none"
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 border border-[#2a3c52] text-slate-300 py-3 rounded text-sm font-medium hover:bg-[#2a3c52] transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-[#d6b980] text-[#101b2a] py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-[#c2a56a] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Зберегти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
