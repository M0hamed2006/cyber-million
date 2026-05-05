import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 يا محمد! المشروع دلوقتي أونلاين وشغال على GitHub Pages 🚀 جرب تكتب رسالة ونشوف!',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setIsTyping(true);

    setTimeout(() => {
      const replies = [
        '🚀 تمام يا محمد!',
        '💡 شغال على GitHub Pages',
        '🔥 المشروع أونلاين دلوقتي',
        '✅ كويس، نجح الرفع'
      ];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="app-container">
      <div className="animated-bg">
        <div className="particles"></div>
      </div>

      <aside className="sidebar">
        <div className="sidebar-header">الجروبات</div>
        <div className="channel-list">
          <div className="channel-item active">
            <span>👥</span>
            <span>الأصدقاء الرئيسي</span>
          </div>
        </div>
      </aside>

      <main className="chat-container">
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="composer">
          <textarea
            className="message-input"
            placeholder="اكتب رسالتك هنا..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button className="btn btn-send" onClick={handleSend}>
            🚀 إرسال
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
