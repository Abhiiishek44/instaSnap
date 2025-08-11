const Conversation = require('../models/conversation');

// Create or get conversation between two users
exports.createOrGetConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
        return res.status(400).json({ message: 'senderId and receiverId are required' });
    }
    try {
        // Build deterministic key to prevent duplicates
        const key = [senderId, receiverId].map(id => id.toString()).sort().join('_');
        let conversation = await Conversation.findOne({ participantsKey: key }).populate('participants', 'userName profilePicture');
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId], participantsKey: key });
            conversation = await Conversation.findById(conversation._id).populate('participants', 'userName profilePicture');
        }
        return res.status(200).json(conversation);
    } catch (err) {
        console.error('createOrGetConversation error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all conversations of a user
exports.getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: 'userId param required' });
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate('participants', 'userName profilePicture');
        return res.status(200).json(conversations);
    } catch (err) {
        console.error('getUserConversations error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single conversation by ID
exports.getConversationById = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) return res.status(400).json({ message: 'conversationId param required' });
        const conversation = await Conversation.findById(conversationId).populate('participants', 'userName profilePicture');
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        return res.status(200).json(conversation);
    } catch (err) {
        console.error('getConversationById error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
