'use client'
// pages/index.tsx
import { useState } from 'react';
import { Message } from '@/app/model/type';

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    debugger;
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
        <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 fixed w-full top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Attendance Assistant</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-20 pb-24 px-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Welcome to Attendance Assistant
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <ExampleCard
                title="Check Absences"
                description="Who was absent this week?"
                onClick={() => setInput("Absent students in this week.")}
              />
              <ExampleCard
                title="Late Arrivals"
                description="Show me who arrived late today"
                onClick={() => setInput("Late Students in this week.")}
              />
              <ExampleCard
                title="Employee Hours"
                description="What are John's working hours?"
                onClick={() => setInput("What are John's working hours?")}
              />
              <ExampleCard
                title="Attendance Overview"
                description="Show me all attendance records"
                onClick={() => setInput("Show me all attendance records")}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {message.role === 'user' ? <UserIcon /> : <AssistantIcon />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about attendance..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {isLoading ? <LoadingIcon /> : <SendIcon />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const ExampleCard = ({ title, description, onClick }) => (
  <button
    onClick={onClick}
    className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
  >
    <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </button>
);

const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AssistantIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);