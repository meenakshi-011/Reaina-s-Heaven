import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Gift } from 'lucide-react';

const HavenAIChat = () => {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm Haven AI ✨ How can I make your day more cozy?",
      sender: "ai"
    }
  ]);

  const [input, setInput] = useState('');

  const isLoggedIn = !!localStorage.getItem("token");

  // ======================================================
  // SEND MESSAGE FUNCTION
  // ======================================================

  const handleSend = async () => {

    if (!input.trim() || !isLoggedIn) return;

    const userMessage = {
      text: input,
      sender: "user"
    };

    // Add user message
    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    const currentInput = input;

    // Clear input
    setInput('');

    try {

      // Add loading message
      setMessages(prev => [
        ...prev,
        {
          text: "Thinking... ✨",
          sender: "ai"
        }
      ]);

      // CALL FASTAPI
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentInput,
          }),
        }
      );

      const data = await response.json();

      // Remove "Thinking..." message
      setMessages(prev => prev.slice(0, -1));

      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          text: data.response || "Something went wrong.",
          sender: "ai"
        }
      ]);

    } catch (error) {

      console.error(error);

      // Remove loading message
      setMessages(prev => prev.slice(0, -1));

      // Error message
      setMessages(prev => [
        ...prev,
        {
          text: "Server error. Please try again later.",
          sender: "ai"
        }
      ]);
    }
  };

  // ======================================================
  // AUTO SCROLL
  // ======================================================

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {

    if (messagesEndRef.current) {

      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }

  }, [messages]);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-28 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[380px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(45,58,45,0.25)] border border-[#e8dcc8]/60 overflow-hidden z-50 flex flex-col transition-all duration-300 transform origin-bottom-right animate-in fade-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-[#2d3a2d] border-b border-[#c8a97e]/20 p-5 flex justify-between items-center relative overflow-hidden">
            {/* Subtle elegant glowing gradient bg for header */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2d3a2d] to-[#1c241c] opacity-90 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#c8a97e]/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 bg-[#fbf9f6] text-[#2d3a2d] border border-[#c8a97e]/40 rounded-full flex items-center justify-center font-serif italic text-xl font-semibold shadow-inner">
                  H
                </div>
                {/* Pulsing online status badge */}
                <div className="absolute bottom-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#2d3a2d]"></span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-white font-bold text-base leading-none tracking-wide">
                  Haven AI
                </h3>
                <p className="text-[#c8a97e] text-[9px] font-bold tracking-[0.18em] mt-1.5 uppercase">
                  Online Sanctuary
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white hover:rotate-90 transition-all duration-300 p-1.5 hover:bg-white/10 rounded-full relative z-10"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 h-[400px] max-h-[60vh] overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-[#fbf9f6] to-[#faf5ee] scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'ai' ? 'justify-start' : 'justify-end'
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* AI Profile Avatar next to messages */}
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-[#2d3a2d] text-white flex items-center justify-center font-serif text-[11px] italic font-semibold border border-[#c8a97e]/25 shrink-0 shadow-sm">
                    H
                  </div>
                )}

                <div className={`flex flex-col ${msg.sender === 'ai' ? 'items-start' : 'items-end'} max-w-[78%]`}>
                  {msg.text === "Thinking... ✨" ? (
                    <div className="bg-white border border-[#f0e8dc] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-[#c8a97e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-[#2d3a2d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-[#c8a97e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${
                        msg.sender === 'ai'
                          ? 'bg-white border border-[#e8dcc8]/60 text-gray-700 rounded-tl-none border-l-[3px] border-l-[#c8a97e]'
                          : 'bg-gradient-to-br from-[#c8a97e] to-[#a88a5c] text-white rounded-tr-none shadow-[#c8a97e]/10'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <span className="text-[9px] text-gray-400 mt-1 px-1">
                    {msg.sender === 'ai' ? 'Haven' : 'You'} • Just now
                  </span>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />

            {!isLoggedIn && (
              <div className="mt-auto py-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-[#e8dcc8] w-full shadow-sm">
                  {/* Decorative flower badge */}
                  <div className="w-14 h-14 bg-gradient-to-br from-[#fff6f4] to-[#fbe3de] border border-[#f5d0c9] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
                    <span className="text-xl">🌸</span>
                  </div>

                  <h4 className="text-sm font-serif text-[#2d3a2d] font-bold mb-2">
                    Join the Sanctuary
                  </h4>

                  <p className="text-[11px] text-gray-500 mb-5 leading-relaxed max-w-[220px] mx-auto">
                    Please log in to chat with our AI concierge and get personalized recommendations.
                  </p>

                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#2d3a2d] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-[#1a231a] hover:scale-105 active:scale-95 transition-all shadow-md inline-block"
                  >
                    Login to Chat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#f0e8dc]">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && handleSend()
                }
                disabled={!isLoggedIn}
                placeholder={
                  isLoggedIn
                    ? "Type your message..."
                    : "Please login to chat..."
                }
                className="w-full bg-[#fbf9f6] border border-[#e8dcc8]/40 rounded-2xl py-3.5 pl-5 pr-14 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#c8a97e]/60 focus:ring-2 focus:ring-[#c8a97e]/15 disabled:opacity-50 transition-all duration-300"
              />

              <button
                onClick={handleSend}
                disabled={!isLoggedIn || !input.trim()}
                className="absolute right-2 top-2 w-9 h-9 bg-[#2d3a2d] text-white disabled:opacity-30 disabled:hover:scale-100 hover:bg-[#1a231a] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5 transform rotate-45 -translate-x-0.5 translate-y-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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
        className={`fixed bottom-6 right-6 w-18 h-18 rounded-full shadow-[0_12px_40px_rgba(72,53,38,0.35)] flex items-center justify-center text-white border border-[#c8a97e]/20 hover:border-[#c8a97e]/55 hover:scale-105 active:scale-95 transition-all duration-300 z-50 group bg-[#483526]`}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-white transition-all duration-500 transform hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* White outline Gift icon */}
            <Gift
              size={30}
              strokeWidth={1.5}
              className="text-white transition-transform group-hover:rotate-6"
            />

            {/* Glowing gold pulsing notification badge */}
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8a97e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#c8a97e] border-2 border-[#483526]"></span>
            </span>
          </div>
        )}
      </button>
    </>
  );
};

export default HavenAIChat;