import { store } from '../data/store.js';

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.userId || req.query.userId || 'usr-1';
    const currentUserEmail = req.user?.email || req.query.email || '';
    const companyId = req.user?.companyId || req.query.companyId;

    let threads = store.conversations.filter((c) => {
      if (companyId && (c.companyId === companyId || c.ownerCompanyId === companyId)) return true;
      if (c.studentId === currentUserId || (currentUserEmail && c.studentEmail?.toLowerCase() === currentUserEmail.toLowerCase())) return true;
      return false;
    });

    return res.json(threads);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve conversations.' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = store.conversations.find((c) => c.id === id);
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    return res.json(thread.messages || []);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

export const createOrGetConversation = async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, companyId, companyName, internshipId, internshipTitle } = req.body;

    let thread = store.conversations.find(
      (c) => (c.studentId === studentId || c.studentEmail === studentEmail) && c.companyId === companyId && c.internshipId === internshipId
    );

    if (!thread) {
      thread = {
        id: `conv-${Date.now()}`,
        studentId: studentId || 'usr-1',
        studentName: studentName || 'Alex Rivera',
        studentEmail: studentEmail || 'student@internx.dev',
        companyId: companyId || 'comp-google',
        companyName: companyName || 'Google LLC',
        internshipId: internshipId || 'int-g-1',
        internshipTitle: internshipTitle || 'Software Engineering Intern',
        lastMessage: 'Conversation initialized.',
        lastMessageAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: companyId,
            senderName: companyName,
            senderRole: 'COMPANY',
            text: `Welcome! This is the direct communication thread with the ${companyName} university hiring team. Feel free to ask questions or discuss next steps.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      store.conversations.unshift(thread);
      store.save();
    }

    return res.json(thread);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to initiate conversation.' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, senderId, senderName, senderRole } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
    }

    const thread = store.conversations.find((c) => c.id === id);
    if (!thread) {
      return res.status(404).json({ success: false, message: 'Conversation thread not found.' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: senderId || req.userId || 'usr-1',
      senderName: senderName || req.user?.name || 'User',
      senderRole: senderRole || req.userRole || 'STUDENT',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    thread.messages.push(newMsg);
    thread.lastMessage = newMsg.text;
    thread.lastMessageAt = newMsg.timestamp;
    store.save();

    // Broadcast over WebSocket!
    if (req.io) {
      req.io.to(`conv:${thread.id}`).emit('chat:new_message', {
        conversationId: thread.id,
        message: newMsg
      });
      // Also notify student / company direct rooms
      req.io.to(`user:${thread.studentId}`).to(`company:${thread.companyId}`).emit('chat:thread_updated', {
        conversationId: thread.id,
        lastMessage: newMsg.text,
        senderName: newMsg.senderName
      });
    }

    return res.status(201).json(newMsg);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};
