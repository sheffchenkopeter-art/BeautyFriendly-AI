
import React, { useState } from 'react';
import { Scissors, Plus, X, Save, Edit2, Trash2, Clock, FolderPlus, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceCategory, ServiceItem } from '../types';

interface ServicesViewProps {
    categories: ServiceCategory[];
    services: ServiceItem[];
    onAddCategory: (title: string) => void;
    onDeleteCategory: (id: string) => void;
    onAddService: (service: ServiceItem) => void;
    onUpdateService: (service: ServiceItem) => void;
    onDeleteService: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ 
    categories, services, 
    onAddCategory, onDeleteCategory,
    onAddService, onUpdateService, onDeleteService 
}) => {
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);
    
    // Track which category we are adding a service to
    const [targetCategoryId, setTargetCategoryId] = useState<string>('');

    // Form State
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    
    // Category Form
    const [categoryTitle, setCategoryTitle] = useState('');

    // Expanded categories state
    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.id));

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const openServiceModal = (categoryId: string, service?: ServiceItem) => {
        setTargetCategoryId(categoryId);
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
        setIsServiceModalOpen(true);
    };

    const handleServiceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newService: ServiceItem = {
            id: editingService ? editingService.id : Date.now().toString(),
            categoryId: targetCategoryId,
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

        setIsServiceModalOpen(false);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryTitle) {
            onAddCategory(categoryTitle);
            setCategoryTitle('');
            setIsCategoryModalOpen(false);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-6 pb-20 md:pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1e2d3d] pb-4 gap-4">
                <h2 className="text-2xl font-serif text-white">Прайс-лист Послуг</h2>
                <button 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="bg-[#101b2a] border border-[#d6b980] text-[#d6b980] hover:bg-[#d6b980] hover:text-[#101b2a] px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                    <FolderPlus className="w-4 h-4" /> <span className="hidden md:inline">Створити Розділ</span>
                </button>
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12 text-slate-500 italic border border-dashed border-[#2a3c52] rounded">
                    <Scissors className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    Створіть перший розділ (наприклад, "Стрижки"), щоб додати послуги.
                </div>
            )}

            <div className="space-y-8">
                {categories.map(category => {
                    const categoryServices = services.filter(s => s.categoryId === category.id);
                    const isExpanded = expandedCategories.includes(category.id);

                    return (
                        <div key={category.id} className="space-y-4 animate-in fade-in">
                            {/* Category Header */}
                            <div className="flex items-center justify-between bg-[#1a2736] p-3 rounded border border-[#2a3c52] group">
                                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleCategory(category.id)}>
                                    <div className={`p-1 rounded hover:bg-[#2a3c52] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-[#d6b980]" />
                                    </div>
                                    <h3 className="text-lg font-serif text-white">{category.title}</h3>
                                    <span className="text-xs text-slate-500 bg-[#101b2a] px-2 py-0.5 rounded-full">{categoryServices.length}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openServiceModal(category.id)}
                                        className="bg-[#d6b980] text-[#101b2a] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#c2a56a] flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Додати послугу
                                    </button>
                                    <button 
                                        onClick={() => onDeleteCategory(category.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-[#101b2a]"
                                        title="Видалити розділ"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Services Grid */}
                            {isExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4 md:pl-0">
                                    {categoryServices.map(service => (
                                        <div key={service.id} className="bg-[#101b2a] rounded border border-[#2a3c52] p-4 hover:border-[#d6b980]/50 transition-all group/card relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-slate-200">{service.title}</h4>
                                                <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openServiceModal(category.id, service)}
                                                        className="p-1.5 bg-[#1a2736] rounded text-slate-400 hover:text-[#d6b980]"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => onDeleteService(service.id)}
                                                        className="p-1.5 bg-[#1a2736] rounded text-slate-400 hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-3 h-8 overflow-hidden">{service.description || '...'}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-[#2a3c52]">
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Clock className="w-3 h-3" /> {service.duration} хв
                                                </div>
                                                <div className="font-bold text-[#d6b980]">₴{service.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {categoryServices.length === 0 && (
                                        <div className="col-span-full py-4 text-center text-xs text-slate-600 border border-dashed border-[#2a3c52] rounded">
                                            Цей розділ порожній. Додайте послугу.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
                    <div className="bg-[#1a2736] w-full max-w-sm rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif text-white">Новий Розділ</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="mb-6">
                                <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide block mb-2">Назва Розділу</label>
                                <input 
                                    type="text"
                                    required
                                    value={categoryTitle}
                                    onChange={(e) => setCategoryTitle(e.target.value)}
                                    placeholder="Наприклад: Фарбування"
                                    className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                                    autoFocus
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-[#d6b980] text-[#101b2a] py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-[#c2a56a] transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Створити
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add/Edit Service Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
                    <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-serif text-white">{editingService ? 'Редагування послуги' : 'Нова послуга'}</h3>
                            <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleServiceSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Назва послуги</label>
                                <input 
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Наприклад: Корінь (до 2см)"
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
                                    onClick={() => setIsServiceModalOpen(false)}
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
