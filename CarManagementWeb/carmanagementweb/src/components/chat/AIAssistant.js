import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Mình là Trợ lý AI của XeKhách. Bạn cần tư vấn chuyến đi nào?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // AI Logic (Giả lập)
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('đà lạt')) {
        aiResponse = "Đà Lạt mùa này rất đẹp! Hiện bên mình đang có chuyến Sài Gòn - Đà Lạt với giá ưu đãi. Bạn có muốn xem lịch trình không?";
      } else if (lowerInput.includes('giá vé') || lowerInput.includes('bao nhiêu')) {
        aiResponse = "Giá vé phụ thuộc vào tuyến đường bạn chọn. Thường dao động từ 150.000 VNĐ đến 350.000 VNĐ. Bạn muốn đi tuyến nào?";
      } else if (lowerInput.includes('đặt vé') || lowerInput.includes('mua vé')) {
        aiResponse = "Để đặt vé, bạn hãy vào mục 'Chuyến đi', chọn tuyến đường và nhấp vào 'Đặt vé' nhé!";
      } else if (lowerInput.includes('thanh toán')) {
        aiResponse = "Bên mình hỗ trợ thanh toán qua VNPay, PayPal và tiền mặt. Rất tiện lợi và an toàn!";
      } else if (lowerInput.includes('xin chào') || lowerInput.includes('hello')) {
        aiResponse = "Chào bạn! Chúc bạn một ngày tốt lành. Mình có thể giúp gì cho chuyến đi sắp tới của bạn?";
      } else {
        aiResponse = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn có thể nói rõ hơn về tuyến đường hoặc vấn đề bạn cần hỗ trợ không?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Nút bấm nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '25px', left: '25px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8832a, #f09a40)',
          border: 'none', boxShadow: '0 8px 25px rgba(232,131,42,0.4)',
          color: '#fff', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s ease', transform: isOpen ? 'scale(0)' : 'scale(1)',
          animation: 'float 3s ease-in-out infinite'
        }}
      >
        <FaRobot />
      </button>

      {/* Cửa sổ Chat */}
      <div style={{
        position: 'fixed', bottom: '25px', left: '25px', zIndex: 1001,
        width: '350px', height: '500px', backgroundColor: '#fff',
        borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'bottom left'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #e8832a, #f09a40)',
          padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaRobot size={20} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>AI Assistant</h5>
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Luôn sẵn sàng hỗ trợ</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body (Messages) */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#faf9f7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.5,
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #e8832a, #f09a40)' : '#fff',
                color: msg.sender === 'user' ? '#fff' : '#1a1410',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: msg.sender === 'ai' ? '1px solid rgba(0,0,0,0.05)' : 'none'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: '#9c8c78', fontStyle: 'italic', fontSize: '0.85rem' }}>
                AI đang suy nghĩ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer (Input) */}
        <div style={{ padding: '16px', backgroundColor: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Form onSubmit={handleSend}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Hỏi AI bất cứ điều gì..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ background: '#faf9f7', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px 0 0 12px', padding: '12px 16px', fontSize: '0.9rem', color: '#1a1410', boxShadow: 'none' }}
              />
              <Button type="submit" style={{ background: 'linear-gradient(135deg, #e8832a, #f09a40)', border: 'none', borderRadius: '0 12px 12px 0', padding: '0 20px', color: '#fff' }}>
                <FaPaperPlane />
              </Button>
            </InputGroup>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
