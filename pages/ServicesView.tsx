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
    const [targetCategoryId, setTargetCategoryId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.id));

    const toggleCategory = (id: string) => { setExpandedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]); };
    const openServiceModal = (categoryId: string, service?: ServiceItem) => { setTargetCategoryId(categoryId); if (service) { setEditingService(service); setTitle(service.title); setPrice(service.price.toString()); setDuration(service.duration.toString()); setDescription(service.description || ''); } else { setEditingService(null); setTitle(''); setPrice(''); setDuration('60'); setDescription(''); } setIsServiceModalOpen(true); };
    const handleServiceSubmit = (e: React.FormEvent) => { e.preventDefault(); const newService: ServiceItem = { id: editingService ? editingService.id : Date.now().toString(), categoryId: targetCategoryId, title, price: parseInt(price), duration: parseInt(duration), description }; if (editingService) { onUpdateService(newService); } else { onAddService(newService); } setIsServiceModalOpen(false); };
    const handleCategorySubmit = (e: React.FormEvent) => { e.preventDefault(); if (categoryTitle) { onAddCategory(categoryTitle); setCategoryTitle(''); setIsCategoryModalOpen(false); } };

    return (
        <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-8 pb-20 md:pb-8 relative animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-main font-bold">Послуги</h2>
                    <p className="text-muted text-sm mt-1 font-light">Керування вашим прайс-листом.</p>
                </div>
                <button onClick={() => setIsCategoryModalOpen(true)} className="bg-primary border border-accent text-accent hover:bg-accent hover:text-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:shadow-accent/20">
                    <FolderPlus className="w-4 h-4" /> <span className="hidden md:inline">Створити Розділ</span>
                </button>
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20 text-muted/50 italic border-2 border-dashed border-border rounded-2xl bg-surface/20">
                    <Scissors className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">Прайс-лист порожній.</p>
                    <p className="text-sm mt-2">Створіть перший розділ (наприклад, "Стрижки"), щоб додати послуги.</p>
                </div>
            )}

            <div className="space-y-6">
                {categories.map(category => {
                    const categoryServices = services.filter(s => s.categoryId === category.id);
                    const isExpanded = expandedCategories.includes(category.id);

                    return (
                        <div key={category.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            {/* Glass Header for Category */}
                            <div className={`flex items-center justify-between glass p-4 rounded-xl border transition-all duration-300 group ${isExpanded ? 'border-accent/30 bg-surface-soft/50' : 'border-border hover:border-muted'}`}>
                                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleCategory(category.id)}>
                                    <div className={`p-2 rounded-full bg-primary border border-border transition-transform duration-300 ${isExpanded ? 'rotate-180 text-accent border-accent' : 'text-muted'}`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-serif text-main font-medium">{category.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted bg-primary px-3 py-1 rounded-full border border-border ml-2">{categoryServices.length}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openServiceModal(category.id)} className="bg-accent text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-accent-hover flex items-center gap-1 shadow-sm transition-all"><Plus className="w-3 h-3" /> <span className="hidden sm:inline">Послуга</span></button>
                                    <button onClick={() => onDeleteCategory(category.id)} className="p-2 text-muted hover:text-red-400 rounded-lg hover:bg-primary border border-transparent hover:border-red-400/30 transition-all" title="Видалити розділ"><Trash className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Services Grid */}
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-2 md:pl-4 transition-all duration-500 ease-in-out origin-top ${isExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                {categoryServices.map(service => (
                                    <div key={service.id} className="bg-surface p-5 rounded-xl border border-border hover:border-accent/40 transition-all group/card relative hover:-translate-y-1 hover:shadow-lg shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-main text-lg font-serif">{service.title}</h4>
                                            <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 absolute top-3 right-3 bg-surface p-1 rounded-lg border border-border shadow-md">
                                                <button onClick={() => openServiceModal(category.id, service)} className="p-1.5 hover:bg-surface-soft rounded text-muted hover:text-accent transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => onDeleteService(service.id)} className="p-1.5 hover:bg-surface-soft rounded text-muted hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted mb-4 h-8 overflow-hidden font-light line-clamp-2">{service.description || 'Опис відсутній'}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                            <div className="flex items-center gap-1.5 text-xs text-muted font-medium uppercase tracking-wide">
                                                <Clock className="w-3.5 h-3.5 text-accent" /> {service.duration} хв
                                            </div>
                                            <div className="font-bold text-accent text-lg">₴{service.price}</div>
                                        </div>
                                    </div>
                                ))}
                                {categoryServices.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-xs text-muted border-2 border-dashed border-border rounded-xl bg-surface/20">
                                        Цей розділ порожній. Додайте першу послугу.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modals using new premium classes */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm animate-in fade-in">
                    <div className="glass w-full max-w-sm rounded-2xl border border-accent/50 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                         <div className="flex justify-between items-center mb-8">
                             <h3 className="text-2xl font-serif text-main">Новий Розділ</h3>
                             <button onClick={() => setIsCategoryModalOpen(false)} className="text-muted hover:text-main"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="mb-8">
                                <label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Назва Розділу</label>
                                <input type="text" required value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)} placeholder="Наприклад: Фарбування" className="input-premium" autoFocus />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3.5 text-xs">Створити</button>
                        </form>
                    </div>
                </div>
            )}

            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm animate-in fade-in">
                    <div className="glass w-full max-w-md rounded-2xl border border-accent/50 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-serif text-main">{editingService ? 'Редагування' : 'Нова послуга'}</h3>
                            <button onClick={() => setIsServiceModalOpen(false)} className="text-muted hover:text-main"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleServiceSubmit} className="space-y-6">
                            <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Назва послуги</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад: Корінь (до 2см)" className="input-premium" /></div>
                             <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Ціна (₴)</label><input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="input-premium" /></div>
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Тривалість (хв)</label><input type="number" required step="15" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-premium" /></div>
                            </div>
                            <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Опис</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Короткий опис..." className="input-premium h-24 resize-none" /></div>
                            <div className="pt-4 flex gap-4 border-t border-border mt-4">
                                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="flex-1 border border-border text-muted py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-soft transition-colors">Скасувати</button>
                                <button type="submit" className="flex-1 btn-primary py-3.5 text-xs">Зберегти</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};