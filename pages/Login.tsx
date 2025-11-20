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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-surface rounded-none shadow-2xl border border-accent/20 overflow-hidden">
        <div className="bg-surface-soft p-10 text-center border-b border-border">
          <div className="w-24 h-24 rounded-full border-[3px] border-accent flex items-center justify-center mx-auto mb-6 shadow-lg bg-gradient-to-b from-accent/10 to-transparent">
            <span className="text-5xl font-serif text-accent tracking-tighter font-medium italic ml-[-2px]">BF</span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif text-accent mb-2 uppercase tracking-widest">Beauty Friendly</h1>
          <p className="text-muted text-xs uppercase tracking-widest mt-3">AI Assistant for Stylists</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-serif text-main mb-8 text-center">
            {isLogin ? 'Вхід' : 'Реєстрація'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-accent uppercase tracking-wide">Ім'я</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary border border-border text-main placeholder:text-muted focus:outline-none focus:border-accent transition-all rounded-none"
                    placeholder="Ваше ім'я"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-accent uppercase tracking-wide">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-border text-main placeholder:text-muted focus:outline-none focus:border-accent transition-all rounded-none"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-accent uppercase tracking-wide">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-border text-main placeholder:text-muted focus:outline-none focus:border-accent transition-all rounded-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="bg-primary/50 p-3 border border-border text-muted text-xs text-center">
               <span className="text-accent">Demo:</span> Введіть будь-які дані для входу.
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent text-primary py-3.5 font-bold text-sm hover:bg-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 rounded-sm"
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
              className="text-muted text-sm hover:text-main transition-colors"
            >
              {isLogin ? 'Створити новий акаунт' : 'Вже маю акаунт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};