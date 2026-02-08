
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../geminiService';
import { Client, UserProfile, Message } from '../types';

interface AIAssistantProps {
  clients: Client[];
  user: UserProfile;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ clients, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Good morning, Agent. How can I help you today? I have access to your client database and can help you with follow-ups, lead analysis, or property status.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const newAiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newAiMessage]);

    let fullResponse = '';
    try {
      const stream = gemini.chatStream(textToSend, clients);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(m => m.id === aiMessageId ? { ...m, content: fullResponse } : m)
        );
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(m => m.id === aiMessageId ? { ...m, content: "I'm sorry, I encountered an error. Please try again." } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { label: 'Who are my hot leads?', icon: 'local_fire_department' },
    { label: 'Suggest follow-ups for today', icon: 'event' },
    { label: 'Review Jonathan Smith', icon: 'person' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full relative">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 ios-blur border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center flex-1">
            <h2 className="text-[#0e141b] dark:text-slate-50 text-lg font-bold leading-tight">SkyAI Assistant</h2>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Live & Connected</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-500">history</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main ref={scrollRef} className="flex-1 flex flex-col p-4 gap-6 max-w-2xl mx-auto w-full pb-48 overflow-y-auto hide-scrollbar">
        {/* Welcome Section */}
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2 shadow-inner border border-primary/5">
            <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
          </div>
          <h3 className="text-2xl font-bold dark:text-white font-display">How can I assist you?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">I can analyze your pipeline, draft follow-up messages, or find client details.</p>
        </div>

        {/* Message Thread */}
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              m.role === 'assistant' 
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
              : 'bg-white border-slate-200 overflow-hidden'
            }`}>
              {m.role === 'assistant' ? (
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              ) : (
                <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
              )}
            </div>
            <div className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <p className="text-[#4e7397] dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider px-1">
                {m.role === 'assistant' ? 'SkyAI' : 'You'}
              </p>
              <div className={`text-sm leading-relaxed max-w-[90%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap ${
                m.role === 'assistant' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none' 
                : 'bg-primary text-white rounded-tr-none'
              }`}>
                {m.content || (isLoading && m.role === 'assistant' ? '...' : '')}
              </div>
            </div>
          </div>
        ))}

        {isLoading && !messages[messages.length-1].content && (
          <div className="flex items-center gap-3 animate-pulse">
             <div className="size-9 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
             <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          </div>
        )}
      </main>

      {/* Bottom Controls */}
      <div className="fixed bottom-24 lg:bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/95 dark:bg-slate-900/95 ios-blur border-t border-slate-100 dark:border-slate-800 z-40">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Suggestion Chips */}
          <div className="flex gap-2 py-1 overflow-x-auto hide-scrollbar">
            {suggestions.map(s => (
              <button 
                key={s.label}
                onClick={() => handleSend(s.label)}
                className="flex items-center gap-2 whitespace-nowrap bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-xs font-bold dark:text-white shadow-sm hover:border-primary/50 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-primary text-[18px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center">
            <input 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4.5 pl-6 pr-14 text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-inner dark:text-white transition-all placeholder:text-slate-400"
              placeholder="Ask SkyAI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={`absolute right-2.5 size-11 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                isLoading || !input.trim() ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-600'
              }`}
            >
              <span className="material-symbols-outlined font-bold">{isLoading ? 'hourglass_top' : 'arrow_upward'}</span>
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-400 uppercase tracking-widest font-bold pb-2">
            AI responses may vary • Powered by Gemini 3 Flash
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
