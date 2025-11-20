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
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-surface rounded-lg shadow-xl border border-border overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-surface z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary border border-accent rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-main">AI Concierge</h3>
            <p className="text-[10px] text-accent uppercase tracking-widest">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex bg-primary rounded p-1 border border-border">
          <button
            onClick={() => setMode('chat')}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-all ${
              mode === 'chat' ? 'bg-accent text-primary' : 'text-muted hover:text-main'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode('image')}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-2 ${
              mode === 'image' ? 'bg-accent text-primary' : 'text-muted hover:text-main'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            Visuals
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-primary">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border ${
              msg.role === 'user' ? 'bg-surface-soft border-border' : 'bg-surface border-accent'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-muted" /> : <Bot className="w-4 h-4 text-accent" />}
            </div>
            
            <div className={`max-w-[85%] rounded p-5 ${
              msg.role === 'user' 
                ? 'bg-surface-soft text-main' 
                : 'bg-surface border border-border text-main'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-7 font-light">{msg.text}</p>
              {msg.imageUrl && (
                <div className="mt-4 rounded border border-border overflow-hidden">
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
             <div className="w-8 h-8 bg-surface border border-accent rounded flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-surface border border-border rounded p-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-accent animate-spin" />
              <span className="text-sm text-muted italic font-serif">
                {mode === 'image' ? 'Створюю візуалізацію...' : 'Аналізую запит...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-surface border-t border-border">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={mode === 'image' ? "Опишіть образ..." : "Ваше запитання..."}
            className="flex-1 bg-primary border border-border rounded px-4 py-3 text-sm text-main focus:border-accent focus:outline-none transition-colors placeholder:text-muted"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-accent text-primary rounded px-6 py-2 hover:bg-accent-hover disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};