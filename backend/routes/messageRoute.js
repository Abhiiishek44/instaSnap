const router = require('express').Router();
const { createOrGetConversation, getUserConversations, getConversationById } = require('../controllers/conversationController');
const { sendMessage, getConversationMessages } = require('../controllers/messageController');
const isAuthenticated = require('../middlewares/auth');

// Conversation routes
router.post('/conversation', isAuthenticated, createOrGetConversation);
router.get('/conversation/user/:userId', isAuthenticated, getUserConversations);
router.get('/conversation/:conversationId', isAuthenticated, getConversationById);

// Message routes
router.post('/message', isAuthenticated, sendMessage);
router.get('/message/:conversationId', isAuthenticated, getConversationMessages);

module.exports = router;