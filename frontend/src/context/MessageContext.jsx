import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import socket from '../Socket';
import { useUser } from './userContext';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]); // list of conversation docs
  const [activeConversation, setActiveConversation] = useState(null); // conversation object
  const [messages, setMessages] = useState([]); // messages for active conversation
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const hasRegistered = useRef(false);
  // Removed unread badge logic per request

  // Helpers
  const enhanceConversation = useCallback((c) => {
    if (!c) return c;
    return {
      ...c,
      lastMessageAt: c.lastMessageAt || c.updatedAt || c.createdAt,
      lastMessagePreview: c.lastMessagePreview || ''
    };
  }, []);

  const updateConversationMeta = useCallback((predicate, updater) => {
    setConversations(prev => prev.map(c => (predicate(c) ? { ...c, ...updater(c) } : c)));
  }, []);

  // Register socket user once
  useEffect(() => {
    if (user?._id && !hasRegistered.current) {
      socket.emit('addUser', user._id);
      hasRegistered.current = true;
    }
  }, [user?._id]);

  // Incoming realtime messages
  useEffect(() => {
    const handler = (data) => {
      if (!data) return;
      const { senderId, receiverId, conversationId, text, content } = data;
      if (senderId !== user?._id && receiverId !== user?._id) return;
      const preview = text || content || '';
      const ts = data.createdAt || new Date().toISOString();
      if (activeConversation && (conversationId === activeConversation._id || activeConversation.participants?.some(p => p._id === senderId || p._id === receiverId))) {
        setMessages(prev => [...prev, data]);
        updateConversationMeta(c => c._id === activeConversation._id, () => ({
          lastMessageAt: ts,
          lastMessagePreview: preview
        }));
        return;
      }
      // Update only metadata for inactive conversations (no unread tracking now)
      let targetId = conversationId || null;
      if (!targetId) {
        const match = conversations.find(c => {
          const ids = (c.participants || []).map(p => p._id || p);
          return ids.includes(senderId) && ids.includes(receiverId);
        });
        if (match) targetId = match._id;
      }
      if (!targetId) return;
      updateConversationMeta(c => c._id === targetId, () => ({
        lastMessageAt: ts,
        lastMessagePreview: preview
      }));
    };
    socket.on('receiveMessage', handler);
    return () => socket.off('receiveMessage', handler);
  }, [activeConversation, user?._id, updateConversationMeta, conversations]);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api/chat',
    withCredentials: true
  });

  // Fetch all conversations for the user
  const fetchConversations = useCallback(async () => {
    if (!user?._id) return [];
    setLoadingConversations(true);
    try {
      const { data } = await api.get(`/conversation/user/${user._id}`);
      const list = Array.isArray(data) ? data : [];
      const seenPair = new Set();
      const dedupedByPair = [];
      for (const c of list) {
        if (!c || !Array.isArray(c.participants)) continue;
        const key = c.participants.map(p => (p?._id || p).toString()).sort().join('_');
        if (seenPair.has(key)) continue; // skip duplicate pair
        seenPair.add(key);
        dedupedByPair.push(enhanceConversation(c));
      }
      setConversations(dedupedByPair);
      return data || [];
    } catch (err) {
      console.error('fetchConversations error:', err);
      setConversations([]);
      return [];
    } finally {
      setLoadingConversations(false);
    }
  }, [user?._id]);

  // Create or get a conversation with another user
  const getOrCreateConversation = useCallback(async (otherUserId) => {
    if (!user?._id || !otherUserId) return null;
    try {
      const { data } = await api.post('/conversation', { senderId: user._id, receiverId: otherUserId });
      // Ensure list contains it
      setConversations(prev => {
        const pairKeyNew = (data.participants || []).map(p => (p?._id || p).toString()).sort().join('_');
        // If any existing conversation has same participant pair, keep earliest and ignore new (or replace if you want newest on top)
        const existsPair = prev.find(c => {
          const key = (c.participants || []).map(p => (p?._id || p).toString()).sort().join('_');
          return key === pairKeyNew;
        });
        if (existsPair) return prev; // already have a conversation for this pair
        const enhanced = enhanceConversation(data);
        return [enhanced, ...prev];
      });
      return data;
    } catch (err) {
      console.error('getOrCreateConversation error:', err);
      return null;
    }
  }, [user?._id, enhanceConversation]);

  // Load messages for a conversation
  const loadConversationMessages = useCallback(async (conversationId) => {
    if (!conversationId) return [];
    setLoadingMessages(true);
    try {
      const { data } = await api.get(`/message/${conversationId}`);
      setMessages(data || []);
      if (data && data.length) {
        const last = data[data.length - 1];
        updateConversationMeta(c => c._id === conversationId, () => ({
          lastMessageAt: last.createdAt || last.updatedAt,
          lastMessagePreview: last.content || last.text || ''
        }));
      }
      return data || [];
    } catch (err) {
      console.error('loadConversationMessages error:', err);
      setMessages([]);
      return [];
    } finally {
      setLoadingMessages(false);
    }
  }, [updateConversationMeta]);

  // Select conversation by id (fetch messages if needed)
  const selectConversation = useCallback(async (conversation) => {
    if (!conversation) return;
    setActiveConversation(conversation);
    await loadConversationMessages(conversation._id);
  // Unread removal not needed anymore
  }, [loadConversationMessages]);

  // Send message (persist + emit)
  const sendMessage = useCallback(async ({ conversationId, receiverId, content }) => {
    if (!user?._id || !conversationId || !receiverId || !content?.trim()) return null;
    setSending(true);
    try {
      const { data } = await api.post('/message', { conversationId, senderId: user._id, receiverId, content: content.trim() });
      setMessages(prev => [...prev, data]);
      // Emit realtime event for receiver
  socket.emit('sendMessage', { senderId: user._id, receiverId, conversationId, text: content.trim(), createdAt: new Date() });
      // Update conversation meta locally
      updateConversationMeta(c => c._id === conversationId, () => ({
        lastMessageAt: data.createdAt || new Date().toISOString(),
        lastMessagePreview: data.content || ''
      }));
      return data;
    } catch (err) {
      console.error('sendMessage error:', err);
      return null;
    } finally {
      setSending(false);
    }
  }, [user?._id, updateConversationMeta]);

  // Initialize conversations on mount when user available
  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const value = {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    sending,
    fetchConversations,
    getOrCreateConversation,
    selectConversation,
    loadConversationMessages,
    sendMessage,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
