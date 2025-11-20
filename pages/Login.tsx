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
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luxury Background Effect */}
      <div className="absolute inset-0 bg-[#0B1120]"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1120] via-transparent to-[#1a2736] opacity-80"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md z-10 p-8">
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full border border-accent/30 flex items-center justify-center mx-auto mb-8 backdrop-blur-md bg-white/5 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
            <span className="text-5xl font-serif text-accent tracking-tighter font-medium italic ml-[-2px]">BF</span>
          </div>
          <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Beauty <span className="text-accent italic">Friendly</span></h1>
          <p className="text-muted text-xs uppercase tracking-[0.3em] font-medium">Professional AI Assistant</p>
        </div>

        <div className="glass rounded-2xl p-8 md:p-10 shadow-2xl border-t border-white/10">
          <div className="flex gap-6 mb-8 border-b border-white/5 pb-2 relative">
             <button 
                onClick={() => setIsLogin(true)}
                className={`text-sm font-bold uppercase tracking-widest pb-2 transition-all ${isLogin ? 'text-accent' : 'text-muted hover:text-white'}`}
             >
                Вхід
             </button>
             <button 
                onClick={() => setIsLogin(false)}
                className={`text-sm font-bold uppercase tracking-widest pb-2 transition-all ${!isLogin ? 'text-accent' : 'text-muted hover:text-white'}`}
             >
                Реєстрація
             </button>
             <div 
                className={`absolute bottom-[-1px] h-[2px] bg-accent transition-all duration-300 w-10 ${isLogin ? 'left-0' : 'left-20'}`}
             ></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="group">
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 pl-8 text-white placeholder:text-muted/50 focus:border-accent focus:outline-none transition-all"
                    placeholder="Ваше ім'я"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-3 pl-8 text-white placeholder:text-muted/50 focus:border-accent focus:outline-none transition-all"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-3 pl-8 text-white placeholder:text-muted/50 focus:border-accent focus:outline-none transition-all"
                  placeholder="Пароль"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
                <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent to-[#B59A60] text-[#0B1120] py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                    {isLogin ? 'Увійти в систему' : 'Створити акаунт'} <ArrowRight className="w-4 h-4" />
                    </>
                )}
                </button>
            </div>
            
            <div className="text-center mt-4">
                <p className="text-xs text-muted">Demo: введіть будь-які дані</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};