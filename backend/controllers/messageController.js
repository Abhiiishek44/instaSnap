const Message = require('../models/messages');

// Send a message (creates if conversation already determined)
exports.sendMessage = async (req, res) => {
    const { conversationId, senderId, receiverId, content } = req.body;
    if (!conversationId || !senderId || !receiverId || !content) {
        return res.status(400).json({ message: 'conversationId, senderId, receiverId, content required' });
    }
    try {
        const newMessage = await Message.create({ conversation: conversationId, sender: senderId, receiver: receiverId, content });
        await newMessage.populate('sender', 'userName profilePicture');
        await newMessage.populate('receiver', 'userName profilePicture');
        return res.status(201).json(newMessage);
    } catch (err) {
        console.error('sendMessage error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all messages in a conversation
exports.getConversationMessages = async (req, res) => {
    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ message: 'conversationId param required' });
    try {
        const messages = await Message.find({ conversation: conversationId })
            .sort({ createdAt: 1 })
            .populate('sender', 'userName profilePicture')
            .populate('receiver', 'userName profilePicture');
        return res.status(200).json(messages);
    } catch (err) {
        console.error('getConversationMessages error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
