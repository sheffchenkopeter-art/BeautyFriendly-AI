
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
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="border-b border-border pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
            <h2 className="text-3xl font-bold text-accent mb-2 font-serif">Фінансова Аналітика</h2>
            <p className="text-muted font-light">Детальний звіт про доходи та витрати.</p>
        </div>
        {/* Updated Button: Using red-500/10 for background and red-600 for text ensures visibility on both Dark and Light themes */}
        <button 
            onClick={() => setIsExpenseModalOpen(true)} 
            className="bg-red-500/10 border border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
            <TrendingDown className="w-4 h-4" /> Додати витрату
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-lg border border-border shadow-lg relative overflow-hidden group transition-all hover:border-accent/50">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Wallet className="w-24 h-24 text-accent" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-muted text-xs uppercase tracking-widest"><Wallet className="w-4 h-4" /> Каса: Готівка</div>
                <p className="text-3xl font-serif text-main">₴{wallets.cash.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-surface p-6 rounded-lg border border-border shadow-lg relative overflow-hidden group transition-all hover:border-accent/50">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CreditCard className="w-24 h-24 text-accent" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-muted text-xs uppercase tracking-widest"><CreditCard className="w-4 h-4" /> Каса: Рахунок</div>
                <p className="text-3xl font-serif text-main">₴{wallets.card.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-gradient-to-br from-surface to-primary p-6 rounded-lg border border-accent/30 shadow-lg relative overflow-hidden">
             <div className="absolute right-0 top-0 p-4 opacity-5"><TrendingUp className="w-24 h-24 text-green-400" /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-accent text-xs uppercase tracking-widest"><TrendingUp className="w-4 h-4" /> Чистий прибуток</div>
                {/* Improved logic for profit color visibility */}
                <p className={`text-3xl font-serif ${netProfit >= 0 ? 'text-main' : 'text-red-500'}`}>₴{netProfit.toLocaleString()}</p>
                <p className="text-xs text-muted mt-1">Дохід - Витрати (весь час)</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
             <div className="flex justify-between items-end mb-6"><h3 className="text-xl font-serif text-main">Історія Транзакцій</h3></div>
            <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {transactions.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-primary text-xs uppercase text-muted sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 font-medium tracking-wider">Дата</th>
                                    <th className="p-4 font-medium tracking-wider">Опис</th>
                                    <th className="p-4 font-medium tracking-wider">Категорія</th>
                                    <th className="p-4 font-medium tracking-wider">Метод</th>
                                    <th className="p-4 font-medium tracking-wider text-right">Сума</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-surface-soft transition-colors group">
                                        <td className="p-4 text-sm text-muted whitespace-nowrap">
                                            {t.date.toLocaleDateString('uk-UA')} <span className="text-[10px] opacity-70">{t.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="p-4 text-main font-medium text-sm">{t.description || '-'}</td>
                                        <td className="p-4">
                                            {/* Updated Badge Styles for better contrast on Light Mode */}
                                            <span className={`text-[10px] uppercase px-2 py-1 rounded border font-semibold ${
                                                t.type === 'income' 
                                                ? 'bg-green-500/10 border-green-500/30 text-green-600' 
                                                : 'bg-red-500/10 border-red-500/30 text-red-600'
                                            }`}>
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted text-xs">
                                            {t.paymentMethod === 'card' ? <CreditCard className="w-3 h-3 inline mr-1"/> : <Wallet className="w-3 h-3 inline mr-1"/>}
                                            {t.paymentMethod === 'card' ? 'Картка' : 'Готівка'}
                                        </td>
                                        <td className={`p-4 text-right font-serif font-medium ${t.type === 'income' ? 'text-accent' : 'text-red-500'}`}>
                                            {t.type === 'income' ? '+' : '-'}₴{t.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<div className="p-8 text-center text-muted italic">Транзакцій ще немає.</div>)}
                </div>
            </div>
        </section>
      </div>

      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
             <div className="bg-surface w-full max-w-md rounded-lg border border-red-500/30 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-main flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-500" /> Нова Витрата
                    </h3>
                    <button onClick={() => setIsExpenseModalOpen(false)} className="text-muted hover:text-main">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-red-500 uppercase tracking-wide">Сума (₴)</label>
                        <input type="number" required value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-red-400 focus:outline-none" placeholder="0.00"/>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-red-500 uppercase tracking-wide">Категорія</label>
                        <select value={expCategory} onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)} className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-red-400 focus:outline-none">
                            {Object.values(ExpenseCategory).filter(c => c !== ExpenseCategory.SERVICE).map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-red-500 uppercase tracking-wide">Опис</label>
                        <input type="text" required value={expDesc} onChange={(e) => setExpDesc(e.target.value)} className="w-full bg-primary border border-border rounded px-4 py-3 text-main focus:border-red-400 focus:outline-none" placeholder="Наприклад: Оренда за березень"/>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-red-500 uppercase tracking-wide">Оплата з гаманця</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setExpMethod('cash')} className={`py-3 border rounded text-xs uppercase font-bold flex items-center justify-center gap-2 ${expMethod === 'cash' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted hover:border-main'}`}><Wallet className="w-4 h-4" /> Готівка</button>
                            <button type="button" onClick={() => setExpMethod('card')} className={`py-3 border rounded text-xs uppercase font-bold flex items-center justify-center gap-2 ${expMethod === 'card' ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-border text-muted hover:border-main'}`}><CreditCard className="w-4 h-4" /> Картка</button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest py-3 rounded mt-4 transition-colors shadow-lg shadow-red-500/20">
                        Зберегти витрату
                    </button>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};