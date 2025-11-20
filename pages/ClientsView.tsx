import React, { useState } from 'react';
import { Search, Phone, Calendar, ChevronRight, Plus, X, User, Save, ArrowRight, ClipboardList, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Client, Gender, ClientProfile } from '../types';
import { generateClientAnalysis, identifyClientProfile } from '../services/geminiService';

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
    <div className="h-[calc(100vh-6rem)] md:h-auto flex flex-col space-y-6 pb-20 md:pb-8 relative">
       <div className="flex justify-between items-center border-b border-border pb-4">
        <h2 className="text-2xl font-serif text-main">База Клієнтів</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-accent hover:bg-accent-hover text-primary w-10 h-10 rounded flex items-center justify-center transition-colors shadow-sm"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input type="text" placeholder="Пошук..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded text-main focus:outline-none focus:border-accent transition-colors placeholder:text-muted" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredClients.map(client => (
            <div key={client.id} onClick={() => { setSelectedClient(client === selectedClient ? null : client); setAiAnalysis(null); }} className={`bg-surface p-4 rounded border transition-all cursor-pointer ${selectedClient?.id === client.id ? 'border-accent shadow-lg' : 'border-border hover:border-muted'}`}>
                <div className="flex items-center gap-4">
                    <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                    <div className="flex-1">
                        <h3 className="font-serif text-lg text-main flex items-center gap-2">{client.name} {client.profile && (<span title="Профіль заповнено" className="flex items-center justify-center"><Sparkles className="w-3 h-3 text-accent" /></span>)}</h3>
                        <p className="text-xs text-muted uppercase tracking-wider">{client.phone}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted transition-transform ${selectedClient?.id === client.id ? 'rotate-90 text-accent' : ''}`} />
                </div>

                {selectedClient?.id === client.id && (
                    <div className="mt-4 pt-4 border-t border-border text-sm animate-in fade-in slide-in-from-top-2">
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-primary p-3 rounded border border-border"><div className="flex items-center gap-2 text-muted mb-1 text-xs uppercase"><Calendar className="w-3 h-3" /> Останній візит</div><span className="font-serif text-main">{client.lastVisit}</span></div>
                             <div className="bg-primary p-3 rounded border border-border"><div className="flex items-center gap-2 text-muted mb-1 text-xs uppercase"><Phone className="w-3 h-3" /> Контакт</div><a href={`tel:${client.phone}`} className="text-accent hover:underline">{client.phone}</a></div>
                         </div>
                         {client.gender === 'female' && client.profile && (
                             <div className="mb-4">
                                 <button onClick={(e) => { e.stopPropagation(); handleGenerateAnalysis(client); }} className="w-full bg-gradient-to-r from-accent/20 to-primary border border-accent text-accent py-2 rounded flex items-center justify-center gap-2 hover:bg-accent/30 transition-colors">{isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}{isAiLoading ? 'AI аналізує...' : 'AI Аналіз Профілю'}</button>
                                 {aiAnalysis && (<div className="mt-3 bg-primary p-4 rounded border border-accent/30 text-muted text-xs leading-relaxed whitespace-pre-wrap animate-in fade-in">{aiAnalysis}</div>)}
                             </div>
                         )}
                         {client.profile && (
                             <div className="bg-primary p-3 rounded border border-border mb-4 grid grid-cols-2 gap-2 text-xs">
                                 <div><span className="text-muted block">Кольоротип:</span> <span className="text-main">{client.profile.colorType || '-'}</span></div>
                                 <div><span className="text-muted block">Форма обличчя:</span> <span className="text-main">{client.profile.faceShape || '-'}</span></div>
                                 <div><span className="text-muted block">Стан:</span> <span className="text-main">{client.profile.hairCondition || '-'}</span></div>
                                 <div><span className="text-muted block">Структура:</span> <span className="text-main">{client.profile.hairStructure || '-'}</span></div>
                             </div>
                         )}
                         <div className="bg-surface-soft p-3 rounded border border-border text-muted"><span className="text-accent text-[10px] uppercase font-bold block mb-1">Нотатки</span><p className="font-light italic">{client.notes || "Немає нотаток"}</p></div>
                         <div className="mt-4 flex gap-3"><button className="flex-1 bg-accent text-primary py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-accent-hover">Історія</button><button className="flex-1 border border-border text-muted py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-surface-soft hover:text-main">Редагувати</button></div>
                    </div>
                )}
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-md rounded-lg border border-accent shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-serif text-main">Новий Клієнт {step > 1 && '(Профіль)'}</h3><button onClick={handleModalClose} className="text-muted hover:text-main"><X className="w-5 h-5" /></button></div>
                <form onSubmit={step === 1 ? handleNextStep : (e) => { e.preventDefault(); handleSubmit(); }}>
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-left-4">
                            <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Ім'я та Прізвище</label><input type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Анна Петренко" className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-accent focus:outline-none" /></div>
                            <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Телефон</label><input type="tel" required value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="+380" className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-accent focus:outline-none" /></div>
                            <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Стать</label><div className="flex gap-2"><button type="button" onClick={() => setNewClientGender('female')} className={`flex-1 py-2 rounded border text-sm font-medium ${newClientGender === 'female' ? 'bg-accent text-primary border-accent' : 'bg-primary text-muted border-border'}`}>Жінка</button><button type="button" onClick={() => setNewClientGender('male')} className={`flex-1 py-2 rounded border text-sm font-medium ${newClientGender === 'male' ? 'bg-accent text-primary border-accent' : 'bg-primary text-muted border-border'}`}>Чоловік</button></div></div>
                             <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Нотатки (Загальні)</label><textarea value={newClientNotes} onChange={(e) => setNewClientNotes(e.target.value)} placeholder="..." className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-accent focus:outline-none h-20 resize-none" /></div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            
                            {/* AI Identifier Section */}
                            <div className="bg-gradient-to-br from-primary to-surface p-4 rounded border border-accent/50">
                                <div className="flex items-center gap-2 mb-2 text-accent">
                                    <Wand2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">AI Визначення Типу</span>
                                </div>
                                <textarea 
                                    value={observationText} 
                                    onChange={(e) => setObservationText(e.target.value)} 
                                    placeholder="Опишіть клієнта своїми словами (очі, шкіра, колір волосся, форма обличчя...)" 
                                    className="w-full bg-surface-soft border border-border rounded px-3 py-2 text-sm text-main focus:border-accent focus:outline-none h-20 resize-none mb-3 placeholder:text-muted" 
                                />
                                <button 
                                    type="button"
                                    onClick={handleIdentifyProfile}
                                    disabled={isIdentifying || !observationText.trim()}
                                    className="w-full bg-accent/20 border border-accent text-accent py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isIdentifying ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4" />}
                                    Визначити характеристики (AI)
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Кольоротип</label><select value={profileColorType} onChange={(e) => setProfileColorType(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-2 text-main focus:border-accent focus:outline-none"><option value="">Не визначено</option><option value="Весна">Весна</option><option value="Літо">Літо</option><option value="Осінь">Осінь</option><option value="Зима">Зима</option></select></div>
                                <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Форма обличчя</label><select value={profileFaceShape} onChange={(e) => setProfileFaceShape(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-2 text-main focus:border-accent focus:outline-none"><option value="">Не визначено</option><option value="Овал">Овал</option><option value="Круг">Круг</option><option value="Квадрат">Квадрат</option><option value="Трикутник">Трикутник</option><option value="Ромб">Ромб</option><option value="Прямокутник">Прямокутник</option></select></div>
                            </div>
                            <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Стан волосся</label><select value={profileCondition} onChange={(e) => setProfileCondition(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-2 text-main focus:border-accent focus:outline-none"><option value="">Не визначено</option><option value="Натуральне">Натуральне</option><option value="Фарбоване">Фарбоване</option><option value="Пористе">Пористе</option><option value="Пошкоджене">Пошкоджене</option><option value="Скляне (Сивина)">Скляне (Сивина)</option></select></div>
                            <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Густота</label><select value={profileDensity} onChange={(e) => setProfileDensity(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-2 text-main focus:border-accent focus:outline-none"><option value="">-</option><option value="Тонке">Тонке</option><option value="Середнє">Середнє</option><option value="Густе">Густе</option></select></div>
                                <div className="space-y-2"><label className="text-xs font-medium text-accent uppercase tracking-wide">Структура</label><select value={profileStructure} onChange={(e) => setProfileStructure(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-2 text-main focus:border-accent focus:outline-none"><option value="">-</option><option value="Пряме">Пряме</option><option value="Хвилясте">Хвилясте</option><option value="Кучеряве">Кучеряве</option></select></div>
                            </div>
                        </div>
                    )}
                    <div className="pt-4 flex gap-3">
                        {step === 2 && (<button type="button" onClick={() => setStep(1)} className="border border-border text-muted px-4 rounded text-sm hover:bg-surface-soft">Назад</button>)}
                        <button type="submit" className="flex-1 bg-accent text-primary py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">{step === 1 && newClientGender === 'female' ? (<>Далі (Профіль) <ArrowRight className="w-4 h-4" /></>) : (<><Save className="w-4 h-4" /> Зберегти</>)}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};