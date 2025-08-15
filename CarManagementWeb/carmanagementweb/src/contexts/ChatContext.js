import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ChatService from '../services/ChatService';
import { MyUserContext } from './Contexts';
import NotificationUtils from '../utils/NotificationUtils';

const ChatContext = createContext();

const initialState = {
  isOpen: false,
  conversations: [],
  activeConversation: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  availableUsers: []
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CHAT':
      return { ...state, isOpen: true };
    case 'CLOSE_CHAT':
      return { ...state, isOpen: false };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversation: action.payload, messages: [] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AVAILABLE_USERS':
      return { ...state, availableUsers: action.payload };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const user = useContext(MyUserContext);

  // Track window focus for notifications
  useEffect(() => {
    const handleFocus = () => NotificationUtils.resetNotifications();
    const handleBlur = () => { };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Request notification permission
    NotificationUtils.requestNotificationPermission();

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;

    try {
      // Lắng nghe conversations
      const unsubscribeConversations = ChatService.listenToConversations(
        user.id.toString(),
        (conversations) => {
          dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
        },
        user.userRole
      );

      // Lắng nghe unread count
      const unsubscribeUnread = ChatService.getUnreadCount(
        user.id.toString(),
        (count) => {
          dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
        },
        user.userRole
      );

      // Lấy available users
      ChatService.getAvailableUsers(user).then(users => {
        dispatch({ type: 'SET_AVAILABLE_USERS', payload: users });
      }).catch(error => {
        console.error("Error getting available users:", error);
      });

      return () => {
        unsubscribeConversations();
        unsubscribeUnread();
      };
    } catch (error) {
      console.error("Error setting up chat listeners:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!state.activeConversation) return;

    let previousMessageCount = 0;
    const callBack = (messages) => {
        if (messages.length > previousMessageCount && previousMessageCount > 0) {
          const newMessages = messages.slice(previousMessageCount);
          newMessages.forEach(message => {
            if (message.senderId !== user?.id?.toString()) {
              const isWindowFocused = document.hasFocus();
              NotificationUtils.notifyNewMessage(
                message.senderName,
                message.message,
                isWindowFocused
              );
            }
          });
        }
        previousMessageCount = messages.length;

        dispatch({ type: 'SET_MESSAGES', payload: messages });

        // Đánh dấu đã đọc
        if (user && user.id) {
          ChatService.markMessagesAsRead(state.activeConversation.id, user.id.toString());
        }
      }

    // Lắng nghe messages của conversation đang active
    const unsubscribeMessages = ChatService.listenToMessages(
      state.activeConversation.id,
      callBack
    );

    return unsubscribeMessages;
  }, [state.activeConversation, user]);

  const openChat = () => {
    dispatch({ type: 'OPEN_CHAT' });
  };

  const closeChat = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  };

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  const selectConversation = (conversation) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
  };

  const startNewConversation = async (targetUser) => {
    if (!user) return;

    let conversationId;

    if (targetUser.isSupport) {
      // Support conversation
      conversationId = ChatService.createSupportConversationId(user.id.toString(), user.userRole);
    } else {
      // Direct conversation
      conversationId = ChatService.createConversationId(user.id.toString(), targetUser.id.toString());
    }

    const newConversation = {
      id: conversationId,
      participants: {
        [user.id]: {
          name: user.username,
          role: user.userRole
        },
        [targetUser.id]: {
          name: targetUser.name,
          role: targetUser.role
        }
      }
    };

    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: newConversation });
    dispatch({ type: 'OPEN_CHAT' });
  };

  const sendMessage = async (message) => {
    if (!user || !state.activeConversation || !message.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await ChatService.sendMessage(
        state.activeConversation.id,
        user.id.toString(),
        user.username,
        user.userRole,
        message.trim()
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    openChat,
    closeChat,
    toggleChat,
    selectConversation,
    startNewConversation,
    sendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
