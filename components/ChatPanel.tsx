import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <Bot size={48} className="opacity-50" />
        <p className="text-sm">Start speaking to see translations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-4 animate-fadeIn">
          <div className="shrink-0 mt-1">
            {msg.sender === 'user' ? (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User size={16} className="text-slate-300" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-700">
              <p className="text-slate-200 leading-relaxed text-sm">
                "{msg.text}"
              </p>
            </div>
            {msg.gloss && (
              <div className="flex items-center gap-2 pl-2">
                 <div className="h-px w-4 bg-slate-700"></div>
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Gloss</span>
                 <p className="font-mono text-sm text-indigo-300 font-bold tracking-wide">
                   {msg.gloss}
                 </p>
              </div>
            )}
            <p className="text-[10px] text-slate-500 pl-2">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
