import React, { useState } from 'react';
import { Search, Phone, Calendar, ChevronRight, Plus, X, User, Save, ArrowRight, ClipboardList, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Client, Gender, ClientProfile } from '../types';
import { generateClientAnalysis, identifyClientProfile } from '../services/geminiService';
import { AIAvatar } from '../components/AIAvatar';

interface ClientsViewProps {
    clients: Client[];
    onAddClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ clients, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');
  const [newClientGender, setNewClientGender] = useState<Gender>('female');
  
  const [observationText, setObservationText] = useState('');
  const [isIdentifying, setIsIdentifying] = useState(false);

  const [profileColorType, setProfileColorType] = useState('');
  const [profileCondition, setProfileCondition] = useState('');
  const [profileFaceShape, setProfileFaceShape] = useState('');
  const [profileDensity, setProfileDensity] = useState('');
  const [profileStructure, setProfileStructure] = useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleModalClose = () => { setIsModalOpen(false); resetForm(); };
  const resetForm = () => { setStep(1); setNewClientName(''); setNewClientPhone(''); setNewClientNotes(''); setNewClientGender('female'); setObservationText(''); setProfileColorType(''); setProfileCondition(''); setProfileFaceShape(''); setProfileDensity(''); setProfileStructure(''); };
  const handleNextStep = (e: React.FormEvent) => { e.preventDefault(); if (newClientGender === 'male') { handleSubmit(); } else { setStep(2); } };
  const handleSubmit = () => { const profile: ClientProfile | undefined = newClientGender === 'female' ? { colorType: profileColorType || 'Не визначено', hairCondition: profileCondition || 'Не визначено', faceShape: profileFaceShape || 'Не визначено', hairDensity: profileDensity || 'Не визначено', hairStructure: profileStructure || 'Не визначено' } : undefined; const newClient: Client = { id: Date.now().toString(), name: newClientName, phone: newClientPhone, gender: newClientGender, notes: newClientNotes, lastVisit: 'Новий', avatarUrl: `https://ui-avatars.com/api/?name=${newClientName}&background=d6b980&color=101b2a`, profile: profile }; onAddClient(newClient); handleModalClose(); };
  const handleGenerateAnalysis = async (client: Client) => { if (!client.profile) return; setIsAiLoading(true); setAiAnalysis(null); const result = await generateClientAnalysis(client.name, client.profile); setAiAnalysis(result); setIsAiLoading(false); };
  const handleIdentifyProfile = async () => { if (!observationText.trim()) return; setIsIdentifying(true); try { const profile = await identifyClientProfile(observationText); if (profile.colorType) setProfileColorType(profile.colorType); if (profile.faceShape) setProfileFaceShape(profile.faceShape); if (profile.hairCondition) setProfileCondition(profile.hairCondition); if (profile.hairDensity) setProfileDensity(profile.hairDensity); if (profile.hairStructure) setProfileStructure(profile.hairStructure); } catch (error) { console.error("Failed to identify profile", error); } finally { setIsIdentifying(false); } };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-6 pb-20 md:pb-8 relative animate-in fade-in duration-500">
       <div className="flex justify-between items-center border-b border-border pb-6">
        <h2 className="text-3xl font-serif text-main font-medium">База Клієнтів</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-12 h-12 rounded-full flex items-center justify-center p-0"><Plus className="w-6 h-6" /></button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input type="text" placeholder="Пошук за ім'ям або телефоном..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-4 text-main focus:border-accent focus:outline-none transition-all placeholder:text-muted shadow-sm" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredClients.map(client => (
            <div key={client.id} onClick={() => { setSelectedClient(client === selectedClient ? null : client); setAiAnalysis(null); }} className={`bg-surface p-5 rounded-xl border transition-all cursor-pointer ${selectedClient?.id === client.id ? 'border-accent shadow-lg bg-surface-soft scale-[1.01]' : 'border-border hover:border-muted hover:bg-surface-soft/50'}`}>
                <div className="flex items-center gap-5">
                    <img src={client.avatarUrl} alt={client.name} className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-sm" />
                    <div className="flex-1">
                        <h3 className="font-serif text-lg text-main flex items-center gap-2 font-medium">{client.name} {client.profile && (<span title="Профіль заповнено" className="flex items-center justify-center bg-accent/10 p-1 rounded-full"><Sparkles className="w-3 h-3 text-accent" /></span>)}</h3>
                        <p className="text-xs text-muted uppercase tracking-wider font-medium mt-1">{client.phone}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted transition-transform duration-300 ${selectedClient?.id === client.id ? 'rotate-90 text-accent' : ''}`} />
                </div>

                {selectedClient?.id === client.id && (
                    <div className="mt-6 pt-6 border-t border-border text-sm animate-in fade-in slide-in-from-top-2">
                         {/* Details block same as before, just rendered cleaner */}
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-primary p-4 rounded-lg border border-border"><div className="flex items-center gap-2 text-muted mb-1 text-[10px] uppercase font-bold tracking-wider"><Calendar className="w-3 h-3" /> Останній візит</div><span className="font-serif text-main text-base">{client.lastVisit}</span></div>
                             <div className="bg-primary p-4 rounded-lg border border-border"><div className="flex items-center gap-2 text-muted mb-1 text-[10px] uppercase font-bold tracking-wider"><Phone className="w-3 h-3" /> Контакт</div><a href={`tel:${client.phone}`} className="text-accent hover:underline text-base">{client.phone}</a></div>
                         </div>
                         
                         {/* AI Button and Result */}
                         {client.gender === 'female' && client.profile && (
                             <div className="mb-6">
                                 <button onClick={(e) => { e.stopPropagation(); handleGenerateAnalysis(client); }} className="w-full bg-gradient-to-r from-accent/20 to-primary border border-accent/50 text-accent py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-accent/30 transition-colors font-medium shadow-sm">{isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <AIAvatar className="w-5 h-5" />}{isAiLoading ? 'AI аналізує...' : 'AI Аналіз Профілю'}</button>
                                 {aiAnalysis && (<div className="mt-3 bg-primary p-5 rounded-lg border border-accent/30 text-main text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in shadow-inner">{aiAnalysis}</div>)}
                             </div>
                         )}

                         {/* Profile Tags */}
                         {client.profile && (
                             <div className="bg-primary p-4 rounded-lg border border-border mb-4 grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                                 <div><span className="text-muted block mb-1 text-[10px] uppercase">Кольоротип</span> <span className="text-main font-medium text-sm">{client.profile.colorType || '-'}</span></div>
                                 <div><span className="text-muted block mb-1 text-[10px] uppercase">Форма обличчя</span> <span className="text-main font-medium text-sm">{client.profile.faceShape || '-'}</span></div>
                                 <div><span className="text-muted block mb-1 text-[10px] uppercase">Стан</span> <span className="text-main font-medium text-sm">{client.profile.hairCondition || '-'}</span></div>
                                 <div><span className="text-muted block mb-1 text-[10px] uppercase">Структура</span> <span className="text-main font-medium text-sm">{client.profile.hairStructure || '-'}</span></div>
                             </div>
                         )}

                         <div className="bg-surface-soft p-4 rounded-lg border border-border text-muted"><span className="text-accent text-[10px] uppercase font-bold block mb-2 tracking-wider">Нотатки</span><p className="font-light italic">{client.notes || "Немає нотаток"}</p></div>
                         <div className="mt-6 flex gap-3"><button className="flex-1 bg-accent text-primary py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent-hover shadow-sm transition-all">Історія</button><button className="flex-1 border border-border text-muted py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-soft hover:text-main transition-all">Редагувати</button></div>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Modal with Premium styling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-md rounded-2xl border border-accent shadow-2xl p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative">
                <button onClick={handleModalClose} className="absolute top-6 right-6 text-muted hover:text-main"><X className="w-5 h-5" /></button>
                <div className="mb-8"><h3 className="text-2xl font-serif text-main">Новий Клієнт</h3><p className="text-muted text-sm">{step > 1 ? 'Крок 2: Профіль волосся' : 'Крок 1: Основна інформація'}</p></div>
                
                <form onSubmit={step === 1 ? handleNextStep : (e) => { e.preventDefault(); handleSubmit(); }}>
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-left-4">
                            <div><input type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Ім'я та Прізвище" className="input-premium" /></div>
                            <div><input type="tel" required value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="Телефон (+380...)" className="input-premium" /></div>
                            <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-2">Стать</label><div className="flex gap-3"><button type="button" onClick={() => setNewClientGender('female')} className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${newClientGender === 'female' ? 'bg-accent text-primary border-accent shadow-md' : 'bg-primary text-muted border-border'}`}>Жінка</button><button type="button" onClick={() => setNewClientGender('male')} className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all ${newClientGender === 'male' ? 'bg-accent text-primary border-accent shadow-md' : 'bg-primary text-muted border-border'}`}>Чоловік</button></div></div>
                             <div><textarea value={newClientNotes} onChange={(e) => setNewClientNotes(e.target.value)} placeholder="Нотатки..." className="input-premium h-24 resize-none" /></div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="bg-gradient-to-br from-primary to-surface p-5 rounded-xl border border-accent/50 shadow-inner">
                                <div className="flex items-center gap-2 mb-3 text-accent"><Wand2 className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest">AI Сканер</span></div>
                                <textarea value={observationText} onChange={(e) => setObservationText(e.target.value)} placeholder="Опишіть клієнта своїми словами..." className="w-full bg-surface-soft border border-border rounded-lg px-4 py-3 text-sm text-main focus:border-accent focus:outline-none h-24 resize-none mb-4 placeholder:text-muted" />
                                <button type="button" onClick={handleIdentifyProfile} disabled={isIdentifying || !observationText.trim()} className="w-full bg-accent/10 border border-accent text-accent py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">{isIdentifying ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />} Автозаповнення (AI)</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-1">Кольоротип</label><select value={profileColorType} onChange={(e) => setProfileColorType(e.target.value)} className="input-premium"><option value="">Не визначено</option><option value="Весна">Весна</option><option value="Літо">Літо</option><option value="Осінь">Осінь</option><option value="Зима">Зима</option></select></div>
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-1">Форма</label><select value={profileFaceShape} onChange={(e) => setProfileFaceShape(e.target.value)} className="input-premium"><option value="">Не визначено</option><option value="Овал">Овал</option><option value="Круг">Круг</option><option value="Квадрат">Квадрат</option><option value="Трикутник">Трикутник</option><option value="Ромб">Ромб</option></select></div>
                            </div>
                            {/* ... Additional selects ... */}
                             <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-1">Стан</label><select value={profileCondition} onChange={(e) => setProfileCondition(e.target.value)} className="input-premium"><option value="">-</option><option value="Натуральне">Натуральне</option><option value="Фарбоване">Фарбоване</option><option value="Пористе">Пористе</option><option value="Пошкоджене">Пошкоджене</option></select></div>
                                <div><label className="text-xs font-bold text-accent uppercase tracking-wide block mb-1">Структура</label><select value={profileStructure} onChange={(e) => setProfileStructure(e.target.value)} className="input-premium"><option value="">-</option><option value="Пряме">Пряме</option><option value="Хвилясте">Хвилясте</option><option value="Кучеряве">Кучеряве</option></select></div>
                             </div>
                        </div>
                    )}
                    <div className="pt-6 flex gap-3 border-t border-border mt-6">
                        {step === 2 && (<button type="button" onClick={() => setStep(1)} className="border border-border text-muted px-6 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-soft transition-colors">Назад</button>)}
                        <button type="submit" className="flex-1 btn-primary py-4 text-xs">{step === 1 && newClientGender === 'female' ? (<>Далі <ArrowRight className="w-4 h-4 inline ml-1" /></>) : (<><Save className="w-4 h-4 inline mr-1" /> Зберегти</>)}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};