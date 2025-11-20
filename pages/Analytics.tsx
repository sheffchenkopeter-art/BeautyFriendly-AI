import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard, X } from 'lucide-react';
import { WalletState, Transaction, ExpenseCategory, PaymentMethod } from '../types';

interface AnalyticsProps {
  wallets: WalletState;
  transactions: Transaction[];
  onAddExpense: (amount: number, category: ExpenseCategory, description: string, method: PaymentMethod) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ wallets, transactions, onAddExpense }) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>(ExpenseCategory.MATERIALS);
  const [expDesc, setExpDesc] = useState('');
  const [expMethod, setExpMethod] = useState<PaymentMethod>('card');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleExpenseSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!expAmount) return;
      onAddExpense(parseFloat(expAmount), expCategory, expDesc, expMethod);
      setIsExpenseModalOpen(false);
      setExpAmount(''); setExpDesc(''); setExpCategory(ExpenseCategory.MATERIALS);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8 animate-in fade-in duration-500">
      <header className="border-b border-border pb-6 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
            <h2 className="text-4xl font-bold text-main mb-2 font-serif tracking-tight">Фінанси</h2>
            <p className="text-muted font-light text-sm tracking-wide">Повний контроль над грошовими потоками.</p>
        </div>
        <button 
            onClick={() => setIsExpenseModalOpen(true)} 
            className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm hover:shadow-red-500/20"
        >
            <TrendingDown className="w-4 h-4" /> Додати витрату
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-2xl relative overflow-hidden group transition-all hover:-translate-y-1 duration-300 shadow-lg">
            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet className="w-24 h-24 text-accent" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-accent text-xs uppercase tracking-[0.2em] font-bold"><Wallet className="w-4 h-4" /> Готівка</div>
                <p className="text-4xl font-serif text-main">₴{wallets.cash.toLocaleString()}</p>
            </div>
        </div>
        <div className="glass p-8 rounded-2xl relative overflow-hidden group transition-all hover:-translate-y-1 duration-300 shadow-lg">
             <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><CreditCard className="w-24 h-24 text-accent" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-accent text-xs uppercase tracking-[0.2em] font-bold"><CreditCard className="w-4 h-4" /> Рахунок</div>
                <p className="text-4xl font-serif text-main">₴{wallets.card.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-gradient-to-br from-surface to-surface-soft p-8 rounded-2xl border border-accent/20 shadow-xl relative overflow-hidden hover:-translate-y-1 transition-all duration-300">
             <div className="absolute right-0 top-0 p-6 opacity-5"><TrendingUp className="w-24 h-24 text-green-400" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-accent text-xs uppercase tracking-[0.2em] font-bold"><TrendingUp className="w-4 h-4" /> Прибуток</div>
                <p className={`text-4xl font-serif ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                    {netProfit >= 0 ? '+' : ''}₴{netProfit.toLocaleString()}
                </p>
                <p className="text-xs text-muted mt-2 font-light opacity-70">Чистий дохід за весь час</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pt-4">
        <section>
             <div className="flex justify-between items-end mb-6 px-2"><h3 className="text-2xl font-serif text-main font-medium">Історія Транзакцій</h3></div>
            <div className="glass rounded-2xl overflow-hidden shadow-lg border border-border/50">
                <div className="overflow-x-auto">
                    {transactions.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-surface-soft/50 text-[10px] uppercase text-muted sticky top-0 z-10 font-bold tracking-widest">
                                <tr>
                                    <th className="p-5 font-bold tracking-wider border-b border-border">Дата</th>
                                    <th className="p-5 font-bold tracking-wider border-b border-border">Опис</th>
                                    <th className="p-5 font-bold tracking-wider border-b border-border">Категорія</th>
                                    <th className="p-5 font-bold tracking-wider border-b border-border">Метод</th>
                                    <th className="p-5 font-bold tracking-wider text-right border-b border-border">Сума</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-5 text-sm text-muted whitespace-nowrap font-medium">
                                            {t.date.toLocaleDateString('uk-UA')} <span className="text-[10px] opacity-60 ml-2 font-light">{t.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="p-5 text-main text-sm">{t.description || '-'}</td>
                                        <td className="p-5">
                                            <span className={`text-[10px] uppercase px-3 py-1 rounded-full border font-bold tracking-wider ${
                                                t.type === 'income' 
                                                ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-5 text-muted text-xs">
                                            <div className="flex items-center gap-2">
                                                {t.paymentMethod === 'card' ? <CreditCard className="w-3 h-3 opacity-70"/> : <Wallet className="w-3 h-3 opacity-70"/>}
                                                {t.paymentMethod === 'card' ? 'Картка' : 'Готівка'}
                                            </div>
                                        </td>
                                        <td className={`p-5 text-right font-serif text-lg ${t.type === 'income' ? 'text-accent' : 'text-red-500'}`}>
                                            {t.type === 'income' ? '+' : '-'}₴{t.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<div className="p-12 text-center text-muted/50 italic">Транзакцій ще немає.</div>)}
                </div>
            </div>
        </section>
      </div>

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm animate-in fade-in">
             <div className="glass w-full max-w-md rounded-2xl border border-red-500/20 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif text-main flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg"><TrendingDown className="w-5 h-5 text-red-500" /></div>
                        Нова Витрата
                    </h3>
                    <button onClick={() => setIsExpenseModalOpen(false)} className="text-muted hover:text-main"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleExpenseSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wide block mb-2">Сума (₴)</label>
                        <input type="number" required value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="input-premium focus:border-red-500/50 focus:bg-red-500/5" placeholder="0.00"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wide block mb-2">Категорія</label>
                        <select value={expCategory} onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)} className="input-premium focus:border-red-500/50 focus:bg-red-500/5">
                            {Object.values(ExpenseCategory).filter(c => c !== ExpenseCategory.SERVICE).map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wide block mb-2">Опис</label>
                        <input type="text" required value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className="input-premium focus:border-red-500/50 focus:bg-red-500/5" placeholder="Наприклад: Оренда за березень"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-red-500 uppercase tracking-wide block mb-2">Оплата з гаманця</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setExpMethod('cash')} className={`py-3.5 border rounded-xl text-xs uppercase font-bold flex items-center justify-center gap-2 transition-all ${expMethod === 'cash' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-sm' : 'border-border text-muted hover:border-main'}`}><Wallet className="w-4 h-4" /> Готівка</button>
                            <button type="button" onClick={() => setExpMethod('card')} className={`py-3.5 border rounded-xl text-xs uppercase font-bold flex items-center justify-center gap-2 transition-all ${expMethod === 'card' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-sm' : 'border-border text-muted hover:border-main'}`}><CreditCard className="w-4 h-4" /> Картка</button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold uppercase tracking-widest py-4 rounded-xl mt-4 transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5">
                        Зберегти витрату
                    </button>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};