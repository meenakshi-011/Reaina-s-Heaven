import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HavenAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm Haven AI ✨ How can I make your day more cozy?", sender: "ai" }
  ]);
  const [input, setInput] = useState('');

  const isLoggedIn = !!localStorage.getItem("token");

  const handleSend = () => {
    if (!input.trim() || !isLoggedIn) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: input, sender: "user" }]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "That sounds lovely! I'm currently in demo mode, but I'll be able to help with that soon. 🌸", sender: "ai" }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-[2rem] shadow-2xl border border-[#f0e8dc] overflow-hidden z-50 flex flex-col transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-[#f8f5f2] p-4 flex justify-between items-center border-b border-[#f0e8dc]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#c8a97e] to-[#e6d0b3] rounded-full flex items-center justify-center text-white font-serif italic text-lg shadow-sm">
                H
              </div>
              <h3 className="font-serif text-[#2d3a2d] font-bold text-lg">Haven AI</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-[#fffbf7]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'ai' 
                  ? 'bg-white border border-[#f0e8dc] text-gray-700 self-start rounded-tl-none' 
                  : 'bg-[#c8a97e] text-white self-end rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            ))}
            
            {!isLoggedIn && (
              <div className="mt-auto pt-4 flex flex-col items-center text-center">
                <div className="bg-[#f8f5f2] p-4 rounded-2xl border border-[#e8dcc8] w-full">
                  <p className="text-xs text-gray-600 mb-3 font-medium">Please log in to chat with Haven AI 🌸</p>
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#2d3a2d] text-white text-xs px-5 py-2 rounded-full hover:bg-[#1a231a] transition-colors inline-block"
                  >
                    Login to Chat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-[#f0e8dc]">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={!isLoggedIn}
                placeholder={isLoggedIn ? "Ask anything..." : "Login required..."}
                className="w-full bg-[#f8f5f2] border-none rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a97e]/50 disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={!isLoggedIn || !input.trim()}
                className="absolute right-1 top-1 w-8 h-8 bg-[#c8a97e] rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-[#a67c52] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-12 md:bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-[#4a3623] rounded-full shadow-[0_8px_20px_rgba(74,54,35,0.4)] flex items-center justify-center text-white hover:scale-110 hover:shadow-[0_10px_25px_rgba(74,54,35,0.5)] transition-all duration-300 z-50 group"
      >
        {isOpen ? (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        )}
      </button>
    </>
  );
};

export default HavenAIChat;
