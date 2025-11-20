
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
  
  // Expense Form State
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>(ExpenseCategory.MATERIALS);
  const [expDesc, setExpDesc] = useState('');
  const [expMethod, setExpMethod] = useState<PaymentMethod>('card');

  // Calculate Net Profit (Income - Expense) for all time
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleExpenseSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!expAmount) return;
      
      onAddExpense(parseFloat(expAmount), expCategory, expDesc, expMethod);
      setIsExpenseModalOpen(false);
      setExpAmount('');
      setExpDesc('');
      setExpCategory(ExpenseCategory.MATERIALS);
  };

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="border-b border-[#1e2d3d] pb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
            <h2 className="text-3xl font-bold text-[#d6b980] mb-2 font-serif">Фінансова Аналітика</h2>
            <p className="text-slate-400 font-light">Детальний звіт про доходи та витрати.</p>
        </div>
        <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-red-900/20 border border-red-500/30 text-red-200 hover:bg-red-900/40 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
            <TrendingDown className="w-4 h-4" /> Додати витрату
        </button>
      </header>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a2736] p-6 rounded-lg border border-[#2a3c52] shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-24 h-24 text-[#d6b980]" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase tracking-widest">
                    <Wallet className="w-4 h-4" /> Каса: Готівка
                </div>
                <p className="text-3xl font-serif text-white">₴{wallets.cash.toLocaleString()}</p>
            </div>
        </div>

        <div className="bg-[#1a2736] p-6 rounded-lg border border-[#2a3c52] shadow-lg relative overflow-hidden group">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-24 h-24 text-[#d6b980]" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase tracking-widest">
                    <CreditCard className="w-4 h-4" /> Каса: Рахунок
                </div>
                <p className="text-3xl font-serif text-white">₴{wallets.card.toLocaleString()}</p>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a2736] to-[#101b2a] p-6 rounded-lg border border-[#d6b980]/30 shadow-lg relative overflow-hidden">
             <div className="absolute right-0 top-0 p-4 opacity-5">
                <TrendingUp className="w-24 h-24 text-green-400" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-[#d6b980] text-xs uppercase tracking-widest">
                    <TrendingUp className="w-4 h-4" /> Чистий прибуток
                </div>
                <p className={`text-3xl font-serif ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                    ₴{netProfit.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Дохід - Витрати (весь час)</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Transactions Feed */}
        <section>
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-serif text-white">Історія Транзакцій</h3>
            </div>
            <div className="bg-[#1a2736] rounded-lg border border-[#2a3c52] overflow-hidden">
                <div className="overflow-x-auto">
                    {transactions.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#101b2a] text-xs uppercase text-slate-500 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 font-medium tracking-wider">Дата</th>
                                    <th className="p-4 font-medium tracking-wider">Опис</th>
                                    <th className="p-4 font-medium tracking-wider">Категорія</th>
                                    <th className="p-4 font-medium tracking-wider">Метод</th>
                                    <th className="p-4 font-medium tracking-wider text-right">Сума</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a3c52]">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-[#233040] transition-colors group">
                                        <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                                            {t.date.toLocaleDateString('uk-UA')} <span className="text-[10px] opacity-70">{t.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="p-4 text-white font-medium text-sm">{t.description || '-'}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] uppercase px-2 py-1 rounded border ${
                                                t.type === 'income' ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'
                                            }`}>
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs">
                                            {t.paymentMethod === 'card' ? <CreditCard className="w-3 h-3 inline mr-1"/> : <Wallet className="w-3 h-3 inline mr-1"/>}
                                            {t.paymentMethod === 'card' ? 'Картка' : 'Готівка'}
                                        </td>
                                        <td className={`p-4 text-right font-serif font-medium ${t.type === 'income' ? 'text-[#d6b980]' : 'text-slate-300'}`}>
                                            {t.type === 'income' ? '+' : '-'}₴{t.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-slate-500 italic">
                            Транзакцій ще немає.
                        </div>
                    )}
                </div>
            </div>
        </section>
      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
             <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-red-500/30 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-white flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-400" /> 
                        Нова Витрата
                    </h3>
                    <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-red-300 uppercase tracking-wide">Сума (₴)</label>
                        <input 
                            type="number" 
                            required
                            value={expAmount}
                            onChange={(e) => setExpAmount(e.target.value)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-red-400 focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-red-300 uppercase tracking-wide">Категорія</label>
                        <select 
                            value={expCategory}
                            onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-red-400 focus:outline-none"
                        >
                            {Object.values(ExpenseCategory).filter(c => c !== ExpenseCategory.SERVICE).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs font-medium text-red-300 uppercase tracking-wide">Опис</label>
                        <input 
                            type="text" 
                            required
                            value={expDesc}
                            onChange={(e) => setExpDesc(e.target.value)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-red-400 focus:outline-none"
                            placeholder="Наприклад: Оренда за березень"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-red-300 uppercase tracking-wide">Оплата з гаманця</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setExpMethod('cash')}
                                className={`py-3 border rounded text-xs uppercase font-bold flex items-center justify-center gap-2 ${
                                    expMethod === 'cash' ? 'bg-red-900/20 border-red-400 text-red-400' : 'border-[#2a3c52] text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <Wallet className="w-4 h-4" /> Готівка
                            </button>
                            <button
                                type="button"
                                onClick={() => setExpMethod('card')}
                                className={`py-3 border rounded text-xs uppercase font-bold flex items-center justify-center gap-2 ${
                                    expMethod === 'card' ? 'bg-red-900/20 border-red-400 text-red-400' : 'border-[#2a3c52] text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <CreditCard className="w-4 h-4" /> Картка
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-red-500/80 hover:bg-red-500 text-white font-bold uppercase tracking-widest py-3 rounded mt-4 transition-colors"
                    >
                        Зберегти витрату
                    </button>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};
