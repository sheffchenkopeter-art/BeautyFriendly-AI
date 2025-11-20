import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, User } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#101b2a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a2736] rounded-none shadow-2xl border border-[#d6b980]/20 overflow-hidden">
        <div className="bg-[#0d1623] p-10 text-center border-b border-[#1e2d3d]">
          {/* BF Logo Implementation */}
          <div className="w-24 h-24 rounded-full border-[3px] border-[#d6b980] flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(214,185,128,0.15)] bg-gradient-to-b from-[#d6b980]/10 to-transparent">
            <span className="text-5xl font-serif text-[#d6b980] tracking-tighter font-medium italic ml-[-2px]">BF</span>
          </div>
          {/* Responsive text sizing to prevent overflow on small screens */}
          <h1 className="text-xl md:text-2xl font-serif text-[#d6b980] mb-2 uppercase tracking-widest">Beauty Friendly</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-3">AI Assistant for Stylists</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-serif text-white mb-8 text-center">
            {isLogin ? 'Вхід' : 'Реєстрація'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Ім'я</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#d6b980] transition-colors pointer-events-none" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#101b2a] border border-[#2a3c52] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d6b980] transition-all rounded-none"
                    placeholder="Ваше ім'я"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#d6b980] transition-colors pointer-events-none" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#101b2a] border border-[#2a3c52] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d6b980] transition-all rounded-none"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#d6b980] transition-colors pointer-events-none" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#101b2a] border border-[#2a3c52] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d6b980] transition-all rounded-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="bg-[#101b2a]/50 p-3 border border-[#2a3c52] text-slate-400 text-xs text-center">
               <span className="text-[#d6b980]">Demo:</span> Введіть будь-які дані для входу.
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#d6b980] text-[#101b2a] py-3.5 font-bold text-sm hover:bg-[#c2a56a] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 rounded-sm"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Увійти' : 'Створити акаунт'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              {isLogin ? 'Створити новий акаунт' : 'Вже маю акаунт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};