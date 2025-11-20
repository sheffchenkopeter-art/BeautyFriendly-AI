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
    {
      id: 'start',
      name: 'Start',
      price: '350',
      period: 'міс',
      icon: Star,
      isGold: false,
      features: [
        'Календар записів',
        'База до 50 клієнтів',
        'Базова статистика',
        'Підтримка 24/7'
      ]
    },
    {
      id: 'pro',
      name: 'Gold Club',
      price: '750',
      period: 'міс',
      icon: Crown,
      popular: true,
      isGold: true,
      features: [
        'Все, що в Start',
        'AI Асистент стиліста',
        'Генерація ідей',
        'Безліміт клієнтів',
        'VIP Підтримка'
      ]
    },
    {
      id: 'premium',
      name: 'Platinum',
      price: '1800',
      period: 'міс',
      icon: Zap,
      isGold: false,
      features: [
        'Все, що в Gold',
        'До 5 майстрів',
        'Спільний календар',
        'Фінансова аналітика',
        'Персональний менеджер'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#101b2a] py-12 px-4 flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-serif text-[#d6b980] mb-4">Оберіть свій статус</h2>
        <p className="text-slate-400 font-light">
          Інструменти класу люкс для вашого бізнесу.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`relative bg-[#1a2736] p-8 border transition-all duration-500 hover:-translate-y-2 flex flex-col ${
              plan.popular 
                ? 'border-[#d6b980] shadow-[0_0_30px_rgba(214,185,128,0.1)]' 
                : 'border-[#2a3c52] hover:border-[#d6b980]/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d6b980] text-[#101b2a] px-6 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md">
                Recommended
              </div>
            )}

            <div className="flex justify-center mb-6">
              <plan.icon className={`w-8 h-8 ${plan.isGold ? 'text-[#d6b980]' : 'text-slate-400'}`} />
            </div>

            <h3 className={`text-2xl font-serif text-center mb-2 ${plan.isGold ? 'text-white' : 'text-slate-300'}`}>
              {plan.name}
            </h3>
            
            <div className="flex items-baseline justify-center gap-1 mb-8 border-b border-[#2a3c52] pb-8">
              <span className={`text-4xl font-serif ${plan.isGold ? 'text-[#d6b980]' : 'text-white'}`}>₴{plan.price}</span>
              <span className="text-slate-500 text-sm">/{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                  <Check className={`w-4 h-4 flex-shrink-0 ${plan.isGold ? 'text-[#d6b980]' : 'text-slate-600'}`} />
                  <span className="font-light">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={!!processingPlan}
              className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${
                plan.isGold
                  ? 'bg-[#d6b980] text-[#101b2a] hover:bg-[#c2a56a]'
                  : 'bg-transparent border border-[#2a3c52] text-white hover:bg-[#2a3c52]'
              } ${!!processingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {processingPlan === plan.id ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Обробка
                </div>
              ) : (
                'Обрати'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};