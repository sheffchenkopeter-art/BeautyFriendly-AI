import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Loader2 } from 'lucide-react';

interface SubscriptionProps {
  onSubscribe: (plan: 'start' | 'pro' | 'premium') => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ onSubscribe }) => {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setProcessingPlan(planId);
    // Simulate payment processing delay
    setTimeout(() => {
      onSubscribe(planId as any);
    }, 1500);
  };

  const plans = [
    {
      id: 'start',
      name: 'Start',
      price: '350',
      period: 'міс',
      icon: Star,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      features: [
        'Календар записів',
        'База до 50 клієнтів',
        'Базова статистика',
        'Підтримка 24/7'
      ]
    },
    {
      id: 'pro',
      name: 'Pro AI',
      price: '750',
      period: 'міс',
      icon: Zap,
      popular: true,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
      features: [
        'Все, що в Start',
        'AI Асистент стиліста',
        'Генерація ідей зачісок',
        'Необмежена база клієнтів',
        'Розумна аналітика доходів'
      ]
    },
    {
      id: 'premium',
      name: 'Salon Team',
      price: '1800',
      period: 'міс',
      icon: Crown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      buttonColor: 'bg-slate-900 text-white hover:bg-slate-800',
      features: [
        'Все, що в Pro',
        'До 5 майстрів',
        'Спільний календар',
        'Інвентаризація складу',
        'Персональний менеджер'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Оберіть свій план успіху</h2>
        <p className="text-slate-500 text-lg">
          Отримайте повний доступ до інструментів AI, щоб вивести свій бізнес на новий рівень.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ${
              plan.popular 
                ? 'border-purple-500 shadow-xl shadow-purple-900/10 ring-4 ring-purple-500/10' 
                : 'border-slate-100 shadow-lg'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Найпопулярніший
              </div>
            )}

            <div className={`w-14 h-14 ${plan.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
              <plan.icon className={`w-7 h-7 ${plan.color}`} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">₴{plan.price}</span>
              <span className="text-slate-500">/{plan.period}</span>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={!!processingPlan}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors mb-8 flex items-center justify-center gap-2 ${
                processingPlan === plan.id ? 'bg-slate-800 text-white cursor-wait' : plan.buttonColor
              } ${!!processingPlan && processingPlan !== plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {processingPlan === plan.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Обробка...
                </>
              ) : (
                'Обрати план'
              )}
            </button>

            <ul className="space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-slate-400 text-sm animate-in fade-in duration-1000 delay-500">
        Потрібна допомога з вибором? <a href="#" className="text-purple-600 font-medium">Зв'яжіться з нами</a>
      </p>
    </div>
  );
};