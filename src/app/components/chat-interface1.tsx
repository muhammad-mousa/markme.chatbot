'use client'
// pages/index.tsx
import { useState } from 'react';
import { Message } from '@/app/model/type';

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('/api/analyze-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      
      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: formatAttendanceData(data.response),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const formatAttendanceData = (data: any[]) => {
    return data.map(record => 
      `${record.employee} - ${record.date}: ${record.status} (${record.hours} hours)`
    ).join('\n');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4">
        <button className="w-full bg-gray-700 text-white rounded p-3 flex items-center gap-3">
          <PlusIcon /> New Chat
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-800 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded ${
                message.role === 'user' ? 'bg-gray-700' : 'bg-gray-600'
              }`}
            >
              <p className="text-white whitespace-pre-line">{message.content}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about attendance..."
              className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {isLoading ? (
                <LoadingIcon />
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
