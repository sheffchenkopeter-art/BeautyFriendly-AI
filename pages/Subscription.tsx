import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react';

type SubscriptionPlanId = 'start' | 'pro' | 'premium';

interface SubscriptionProps {
  onSubscribe: (plan: SubscriptionPlanId) => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ onSubscribe }) => {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setProcessingPlan(planId);
    setTimeout(() => {
      onSubscribe(planId as SubscriptionPlanId);
    }, 1500);
  };

  const plans = [
    { id: 'start', name: 'Start', price: '350', period: 'міс', icon: Star, isGold: false, features: ['Календар записів', 'База до 50 клієнтів', 'Базова статистика', 'Підтримка 24/7'] },
    { id: 'pro', name: 'Gold Club', price: '750', period: 'міс', icon: Crown, popular: true, isGold: true, features: ['Все, що в Start', 'AI Асистент стиліста', 'Генерація ідей', 'Безліміт клієнтів', 'VIP Підтримка'] },
    { id: 'premium', name: 'Platinum', price: '1800', period: 'міс', icon: Zap, isGold: false, features: ['Все, що в Gold', 'До 5 майстрів', 'Спільний календар', 'Фінансова аналітика', 'Персональний менеджер'] }
  ];

  return (
    <div className="min-h-screen bg-primary py-12 px-4 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-serif text-accent mb-4">Оберіть свій статус</h2>
        <p className="text-muted font-light">Інструменти класу люкс для вашого бізнесу.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`relative bg-surface p-8 border transition-all duration-500 hover:-translate-y-2 flex flex-col ${
              plan.popular ? 'border-accent shadow-lg' : 'border-border hover:border-accent/50'
            }`}
          >
            {plan.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-6 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md">Recommended</div>)}
            <div className="flex justify-center mb-6"><plan.icon className={`w-8 h-8 ${plan.isGold ? 'text-accent' : 'text-muted'}`} /></div>
            <h3 className={`text-2xl font-serif text-center mb-2 ${plan.isGold ? 'text-main' : 'text-muted'}`}>{plan.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mb-8 border-b border-border pb-8"><span className={`text-4xl font-serif ${plan.isGold ? 'text-accent' : 'text-main'}`}>₴{plan.price}</span><span className="text-muted text-sm">/{plan.period}</span></div>
            <ul className="space-y-4 mb-8 flex-1">{plan.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-3 text-sm text-muted"><Check className={`w-4 h-4 flex-shrink-0 ${plan.isGold ? 'text-accent' : 'text-slate-500'}`} /><span className="font-light">{feature}</span></li>))}</ul>
            <button onClick={() => handleSelectPlan(plan.id)} disabled={!!processingPlan} className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${plan.isGold ? 'bg-accent text-primary hover:bg-accent-hover' : 'bg-transparent border border-border text-main hover:bg-surface-soft'} ${!!processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>{processingPlan === plan.id ? (<div className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Обробка</div>) : ('Обрати')}</button>
          </div>
        ))}
      </div>
    </div>
  );
};