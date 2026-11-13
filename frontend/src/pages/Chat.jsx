
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  Send,
  ShieldCheck,
  Headset,
  Paperclip,
  MoreVertical,
  Clock,
  CheckCheck
} from 'lucide-react';

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [sending, setSending] = useState(false);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // Temporary frontend message handler
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || sending) return;

    const newMessage = {
      id: Date.now(),
      message: message.trim(),
      sender: 'USER',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft size={21} />
            </button>

            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white" size={25} />
            </div>

            <div>
              <h1 className="font-bold text-lg text-gray-900">
                Hamro Aawaj's Support
              </h1>

              <p className="text-xs text-gray-500">
                We're here to help you
              </p>
            </div>

          </div>

          <button className="p-2 hover:bg-gray-100 rounded-xl transition">
            <MoreVertical size={22} className="text-gray-600" />
          </button>

        </div>
      </header>


      {/* Chat Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-3 md:p-6 flex flex-col">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden min-h-[650px]">

          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="relative w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Headset size={24} className="text-blue-600" />

                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Support Team
                </h2>

                <p className="text-xs text-green-600 font-medium">
                  Available to assist
                </p>
              </div>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <Clock size={15} />
              Customer Support
            </div>

          </div>


          {/* Messages Area */}
          <div className="flex-1 p-5 md:p-8 overflow-y-auto bg-slate-50">

            {/* Welcome Message */}
            <div className="text-center mb-8">

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-medium">
                <ShieldCheck size={14} />
                Secure Support Conversation
              </div>

              <p className="text-gray-400 text-xs mt-3">
                Your conversation with the Aetherix support team
              </p>

            </div>


            {messages.length === 0 ? (

              <div className="flex flex-col items-center justify-center text-center py-16">

                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                  <MessageCircle size={36} className="text-blue-600" />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  How can we help you?
                </h3>

                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Have a question or need assistance with your complaint?
                  Send us a message and our support team will help you.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {messages.map((msg) => {

                  const isUser = msg.sender === 'USER';

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >

                      <div className={`max-w-[85%] md:max-w-[65%] ${
                        isUser ? 'items-end' : 'items-start'
                      } flex flex-col`}>

                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.message}
                        </div>

                        <div className="flex items-center gap-1 mt-1.5 px-1">
                          <span className="text-[10px] text-gray-400">
                            {formatTime(msg.created_at)}
                          </span>

                          {isUser && (
                            <CheckCheck size={13} className="text-blue-500" />
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}

                <div ref={messagesEndRef} />

              </div>

            )}

          </div>


          {/* Message Input */}
          <div className="p-4 md:p-5 bg-white border-t border-gray-100">

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3"
            >

              <button
                type="button"
                title="Attachments coming soon"
                className="hidden sm:flex p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
              >
                <Paperclip size={21} />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-gray-100 border border-transparent focus:border-blue-400 focus:bg-white rounded-xl px-5 py-3.5 text-sm outline-none transition"
              />

              <button
                type="submit"
                disabled={!message.trim() || sending}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition shadow-md shadow-blue-100"
              >
                <Send size={20} />
              </button>

            </form>

            <p className="text-center text-[11px] text-gray-400 mt-3">
              Hamro Aawaj's Support • We're happy to help
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}
