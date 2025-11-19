import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, User, Bot, Loader2, X } from 'lucide-react';
import { generateStylingAdvice, generateHairstyleImage } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIStylist: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Привіт! Я ваш AI стиліст-помічник. Допомогти підібрати зачіску, згенерувати ідею або розповісти про тренди?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (mode === 'image') {
        // Image Generation Mode
        const generatedImageUrl = await generateHairstyleImage(userMessage.text);
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Ось візуалізація за запитом: "${userMessage.text}"`,
          imageUrl: generatedImageUrl
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Chat/Advice Mode
        const advice = await generateStylingAdvice(userMessage.text);
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: advice
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Вибачте, сталася помилка при обробці запиту. Будь ласка, перевірте API ключ або спробуйте пізніше.",
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header / Mode Switcher */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">AI Асистент</h3>
            <p className="text-xs text-slate-500">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setMode('chat')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Чат
          </button>
          <button
            onClick={() => setMode('image')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
              mode === 'image' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            Фото
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200' : 'bg-purple-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-slate-200 text-slate-900 rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              {msg.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                  <img src={msg.imageUrl} alt="Generated hairstyle" className="w-full h-auto object-cover" />
                </div>
              )}
              {msg.isError && (
                <div className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Помилка запиту
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm text-slate-500">
                {mode === 'image' ? 'Генерую фото...' : 'Думаю...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={mode === 'image' ? "Опишіть стрижку, яку хочете побачити..." : "Запитайте про стиль або тренди..."}
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-purple-600 text-white rounded-xl px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-slate-400 mt-2">
          {mode === 'image' 
            ? 'Генерація зображень може зайняти декілька секунд.' 
            : 'AI може помилятися. Перевіряйте важливу інформацію.'}
        </p>
      </div>
    </div>
  );
};