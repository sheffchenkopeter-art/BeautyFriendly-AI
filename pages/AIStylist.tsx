import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, User, Bot, Loader2, X } from 'lucide-react';
import { generateStylingAdvice, generateHairstyleImage } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIStylist: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Вітаю. Я ваш персональний AI консультант. Бажаєте обговорити формули фарбування чи переглянути візуалізації?' 
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
        const generatedImageUrl = await generateHairstyleImage(userMessage.text);
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Візуалізація готова. Запит: "${userMessage.text}"`,
          imageUrl: generatedImageUrl
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
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
        text: "Виникла технічна помилка. Перевірте з'єднання.",
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-[#1a2736] rounded-lg shadow-xl border border-[#2a3c52] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2a3c52] flex justify-between items-center bg-[#1a2736] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#101b2a] border border-[#d6b980] rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#d6b980]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-white">AI Concierge</h3>
            <p className="text-[10px] text-[#d6b980] uppercase tracking-widest">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex bg-[#101b2a] rounded p-1 border border-[#2a3c52]">
          <button
            onClick={() => setMode('chat')}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-all ${
              mode === 'chat' ? 'bg-[#d6b980] text-[#101b2a]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('image')}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-2 ${
              mode === 'image' ? 'bg-[#d6b980] text-[#101b2a]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            Visuals
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#101b2a]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border ${
              msg.role === 'user' ? 'bg-[#2a3c52] border-slate-600' : 'bg-[#1a2736] border-[#d6b980]'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-[#d6b980]" />}
            </div>
            
            <div className={`max-w-[85%] rounded p-5 ${
              msg.role === 'user' 
                ? 'bg-[#2a3c52] text-white' 
                : 'bg-[#1a2736] border border-[#2a3c52] text-slate-200'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-7 font-light">{msg.text}</p>
              {msg.imageUrl && (
                <div className="mt-4 rounded border border-[#2a3c52] overflow-hidden">
                  <img src={msg.imageUrl} alt="Generated hairstyle" className="w-full h-auto object-cover" />
                </div>
              )}
              {msg.isError && (
                <div className="mt-2 text-xs text-red-400 font-medium flex items-center gap-2">
                  <X className="w-3 h-3" /> Помилка
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
             <div className="w-8 h-8 bg-[#1a2736] border border-[#d6b980] rounded flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-[#d6b980]" />
            </div>
            <div className="bg-[#1a2736] border border-[#2a3c52] rounded p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-[#d6b980] animate-spin" />
              <span className="text-sm text-slate-400 italic font-serif">
                {mode === 'image' ? 'Створюю візуалізацію...' : 'Аналізую запит...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-[#1a2736] border-t border-[#2a3c52]">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={mode === 'image' ? "Опишіть образ..." : "Ваше запитання..."}
            className="flex-1 bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-sm text-white focus:border-[#d6b980] focus:outline-none transition-colors placeholder:text-slate-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#d6b980] text-[#101b2a] rounded px-6 py-2 hover:bg-[#c2a56a] disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};