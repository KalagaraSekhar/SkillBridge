import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatService } from '../services/api';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  User,
  Building,
  CheckCheck,
  Clock,
  ChevronRight,
  Smile,
  Paperclip
} from 'lucide-react';

export const LiveChatDrawer = ({ isOpen, onClose, initialThreadId = null, initialRecipient = null }) => {
  const { user, role } = useAuth();
  const { socket, isConnected } = useSocket();

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load user's conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      const list = await chatService.getConversations({
        userId: user?.id,
        email: user?.email,
        companyId: user?.companyId
      });
      setThreads(list || []);

      if (initialThreadId) {
        const found = list.find((t) => t.id === initialThreadId);
        if (found) setActiveThread(found);
      } else if (list.length > 0 && !activeThread) {
        setActiveThread(list[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, initialThreadId]);

  // Load messages when activeThread changes
  useEffect(() => {
    if (!activeThread) return;

    const fetchMessages = async () => {
      try {
        const msgs = await chatService.getMessages(activeThread.id);
        setMessages(msgs || []);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    fetchMessages();

    // Join conversation room on WebSocket
    if (socket && isConnected) {
      socket.emit('join:conversation', { conversationId: activeThread.id });
    }
  }, [activeThread, socket, isConnected]);

  // Real-time listener for incoming messages & typing status
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ conversationId, message }) => {
      if (activeThread && activeThread.id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setThreads((prev) =>
        prev.map((t) =>
          t.id === conversationId
            ? { ...t, lastMessage: message.text, lastMessageAt: message.timestamp }
            : t
        )
      );
    };

    const handleTyping = ({ conversationId, userName, isTyping }) => {
      if (activeThread && activeThread.id === conversationId) {
        setTypingUser(isTyping ? userName : null);
      }
    };

    socket.on('chat:new_message', handleNewMessage);
    socket.on('chat:typing_status', handleTyping);

    return () => {
      socket.off('chat:new_message', handleNewMessage);
      socket.off('chat:typing_status', handleTyping);
    };
  }, [socket, activeThread]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && activeThread) {
      socket.emit('chat:typing', {
        conversationId: activeThread.id,
        userName: user?.name || 'Candidate',
        isTyping: true
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing', {
          conversationId: activeThread.id,
          userName: user?.name || 'Candidate',
          isTyping: false
        });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const text = inputText.trim();
    setInputText('');

    try {
      const newMsg = await chatService.sendMessage(activeThread.id, {
        text,
        senderId: user?.id || 'usr-1',
        senderName: user?.name || 'Alex Rivera',
        senderRole: role || 'STUDENT'
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const sendQuickReply = (msgText) => {
    setInputText(msgText);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal/50 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white w-full max-w-xl h-full shadow-soft-lg flex flex-col border-l border-surface-border animate-slide-left">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-surface-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-accent flex items-center justify-center font-heading font-extrabold shadow-soft">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="chat-title" className="font-heading font-bold text-base text-charcoal">
                  Direct Hiring Messages
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-tealSuccess-light text-tealSuccess">
                  <span className="w-1.5 h-1.5 rounded-full bg-tealSuccess animate-pulse" /> Live Real-Time
                </span>
              </div>
              <p className="text-xs text-slateSub">
                Direct encrypted communication channel with hiring teams.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slateSub hover:text-charcoal hover:bg-surface-muted transition-colors"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body (Threads selector if multiple + Message Stream) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Thread Bar */}
          {threads.length > 1 && (
            <div className="px-4 py-2 bg-surface-muted/50 border-b border-surface-border flex items-center gap-2 overflow-x-auto">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThread(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all ${
                    activeThread?.id === t.id
                      ? 'bg-primary text-white shadow-soft-sm'
                      : 'bg-white text-slateSub border border-surface-border hover:text-charcoal'
                  }`}
                >
                  {role === 'COMPANY' ? t.studentName : t.companyName}
                </button>
              ))}
            </div>
          )}

          {/* Active Conversation Context Banner */}
          {activeThread && (
            <div className="px-6 py-2.5 bg-primary-50/70 border-b border-primary-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-primary">
                  {role === 'COMPANY' ? `Applicant: ${activeThread.studentName}` : `Company: ${activeThread.companyName}`}
                </span>
                <span className="text-primary-300">•</span>
                <span className="font-mono text-primary-700 truncate">
                  {activeThread.internshipTitle}
                </span>
              </div>
              <span className="font-mono text-[10px] text-primary-600 shrink-0">
                Encrypted Channel
              </span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface/30">
            {messages.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-muted text-slateSub mx-auto flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-sm text-charcoal">
                  No messages in this channel yet
                </h4>
                <p className="text-xs text-slateSub max-w-xs mx-auto">
                  Send a message to discuss internship scope, interview scheduling, or ask questions.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderRole === role || msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-slateSub">
                      <span className="font-bold text-charcoal">{msg.senderName}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-soft-sm ${
                        isMine
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white text-charcoal border border-surface-border rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}

            {/* Live Typing Indicator */}
            {typingUser && (
              <div className="flex items-center gap-2 text-xs font-mono text-slateSub italic animate-pulse">
                <span>{typingUser} is typing...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-200" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Row */}
          <div className="px-6 py-2 bg-white border-t border-surface-border flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono uppercase text-slateSub shrink-0">Suggestions:</span>
            {[
              role === 'STUDENT' ? 'When is the technical interview?' : 'We would like to invite you for an interview.',
              role === 'STUDENT' ? 'Thank you for reviewing my profile!' : 'Please share your availability for this week.',
              'Here is my updated portfolio link.'
            ].map((suggest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuickReply(suggest)}
                className="px-2.5 py-1 rounded-full bg-surface-muted hover:bg-primary-50 hover:text-primary text-[11px] text-slateSub whitespace-nowrap transition-colors"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-surface-border flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message here (e.g. discuss interview slots, project scope)..."
              className="flex-1 px-4 py-3 bg-surface border border-surface-border rounded-2xl text-xs sm:text-sm text-charcoal focus:outline-none focus:border-primary/40"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-accent hover:bg-accent-hover text-white rounded-2xl shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default LiveChatDrawer;
