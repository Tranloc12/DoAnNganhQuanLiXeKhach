import { database } from '../configs/Firebase';
import {
  ref,
  push,
  onValue,
  off,
  query,
  orderByKey,
  set,
  update,
  serverTimestamp,
  get
} from 'firebase/database';

class ChatService {
  // Tạo conversation ID duy nhất giữa 2 users
  createConversationId(userId1, userId2) {
    const ids = [userId1, userId2].sort();
    return `${ids[0]}_${ids[1]}`;
  }

  // Tạo conversation ID cho support (member/trainer -> manager)
  createSupportConversationId(userId, userRole) {
    return `support_${userRole}_${userId}`;
  }

  // Gửi tin nhắn
  async sendMessage(conversationId, senderId, senderName, senderRole, message, messageType = 'text') {
    try {
      const messagesRef = ref(database, `conversations/${conversationId}/messages`);
      const newMessage = {
        senderId,
        senderName,
        senderRole,
        message,
        messageType,
        timestamp: serverTimestamp(),
        read: false
      };

      await push(messagesRef, newMessage);

      const conversationRef = ref(database, `conversations/${conversationId}`);
      const updates = {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
        lastSenderId: senderId,
        [`participants/${senderId}/name`]: senderName,
        [`participants/${senderId}/role`]: senderRole,
        [`participants/${senderId}/lastSeen`]: serverTimestamp()
      };

      await update(conversationRef, updates);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Lắng nghe tin nhắn mới trong conversation
  listenToMessages(conversationId, callback) {
    const messagesRef = ref(database, `conversations/${conversationId}/messages`);
    const messagesQuery = query(messagesRef, orderByKey());

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(messages);
    });

    return unsubscribe;
  }

  // Lắng nghe danh sách conversations của user
  listenToConversations(userId, callback, userRole = null) {
    const conversationsRef = ref(database, 'conversations');

    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const conversations = [];
      snapshot.forEach((childSnapshot) => {
        const conversationId = childSnapshot.key;
        const conversationData = childSnapshot.val();

        // Kiểm tra nếu user tham gia conversation này
        let shouldInclude = false;

        if (userRole === 'ROLE_MANAGER') {
          // Managers chỉ thấy support conversations
          if (conversationId.startsWith('support_')) {
            // Kiểm tra xem có manager nào đã tham gia chưa
            const participants = conversationData.participants || {};
            const hasManager = Object.values(participants).some(p => p.role === 'ROLE_MANAGER');

            // Nếu chưa có manager nào hoặc manager hiện tại đã tham gia
            if (!hasManager || participants[userId]) {
              shouldInclude = true;
            }
          }
        } else {
          // Các role khác: kiểm tra theo cách cũ
          if (conversationId.includes(userId) ||
            (conversationData.participants && conversationData.participants[userId])) {
            shouldInclude = true;
          }
        }

        if (shouldInclude) {
          conversations.push({
            id: conversationId,
            ...conversationData
          });
        }
      });

      // Sắp xếp theo thời gian tin nhắn cuối
      conversations.sort((a, b) => {
        const timeA = a.lastMessageTime || 0;
        const timeB = b.lastMessageTime || 0;
        return timeB - timeA;
      });

      callback(conversations);
    });

    return unsubscribe;
  }

  // Đánh dấu tin nhắn đã đọc
  async markMessagesAsRead(conversationId, userId) {
    try {
      const messagesRef = ref(database, `conversations/${conversationId}/messages`);
      const snapshot = await get(messagesRef);

      const updates = {};
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        if (messageData.senderId !== userId && !messageData.read) {
          updates[`${childSnapshot.key}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(messagesRef, updates);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Lấy danh sách users để chat (trainers cho members, members cho trainers)
  async getAvailableUsers(currentUser) {
    try {
      // Gọi API để lấy danh sách users
      const { authApis, endpoints } = await import('../configs/Apis.js');

      const users = [];

      if (currentUser.userRole === 'ROLE_MEMBER') {
        // Members có thể chat với trainers và gửi support request
        users.push({
          id: 'support',
          name: 'Hỗ trợ khách hàng',
          role: 'ROLE_MANAGER',
          isSupport: true
        });

        // Lấy danh sách trainers (nếu có API)
        try {
          const response = await authApis().get(endpoints['secure-trainers']);
          if (response.data) {
            response.data.forEach(trainer => {
              users.push({
                id: trainer.id.toString(),
                name: trainer.username || trainer.name,
                role: 'ROLE_TRAINER',
                isSupport: false
              });
            });
          }
        } catch (error) {
          console.log('Could not fetch trainers:', error);
        }

      } else if (currentUser.userRole === 'ROLE_TRAINER') {
        // Trainers có thể chat với members và gửi support request
        users.push({
          id: 'support',
          name: 'Hỗ trợ nhân viên',
          role: 'ROLE_MANAGER',
          isSupport: true
        });

        // Lấy danh sách members (nếu có API)
        try {
          const response = await authApis().get('/secure/progress/members');
          if (response.data) {
            response.data.forEach(member => {
              users.push({
                id: member.id.toString(),
                name: member.username || member.name,
                role: 'ROLE_MEMBER',
                isSupport: false
              });
            });
          }
        } catch (error) {
          console.log('Could not fetch members:', error);
        }
      } else if (currentUser.userRole === 'ROLE_MANAGER') {
        // Managers don't need to start new conversations, they only respond to support requests
        // No users to add for managers as they only see support conversations
      }

      return users;
    } catch (error) {
      console.error('Error getting available users:', error);
      // Fallback to support only
      const users = [];
      if (currentUser.userRole === 'ROLE_PASSENGER') {
        users.push({
          id: 'support',
          name: 'Hỗ trợ khách hàng',
          role: 'ROLE_MANAGER',
          isSupport: true
        });
      } else if (currentUser.userRole === 'ROLE_STAFF') {
        users.push({
          id: 'support',
          name: 'Hỗ trợ nhân viên',
          role: 'ROLE_MANAGER',
          isSupport: true
        });
      } else if (currentUser.userRole === 'ROLE_DRIVER') {
        users.push({
          id: 'support',
          name: 'Hỗ trợ tài xế ',
          role: 'ROLE_MANAGER',
          isSupport: true
        });
      }
      return users;
    }
  }

  // Lấy số tin nhắn chưa đọc
  getUnreadCount(userId, callback, userRole = null) {
    const conversationsRef = ref(database, 'conversations');

    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      let totalUnread = 0;

      snapshot.forEach((childSnapshot) => {
        const conversationId = childSnapshot.key;
        const conversationData = childSnapshot.val();

        // Kiểm tra nếu user tham gia conversation này
        let shouldCount = false;

        if (userRole === 'ROLE_MANAGER') {
          // Managers chỉ đếm tin nhắn từ support conversations
          if (conversationId.startsWith('support_')) {
            const participants = conversationData.participants || {};
            const hasManager = Object.values(participants).some(p => p.role === 'ROLE_MANAGER');

            if (!hasManager || participants[userId]) {
              shouldCount = true;
            }
          }
        } else {
          // Các role khác: kiểm tra theo cách cũ
          if (conversationId.includes(userId) ||
            (conversationData.participants && conversationData.participants[userId])) {
            shouldCount = true;
          }
        }

        if (shouldCount) {
          const messages = conversationData.messages || {};
          Object.values(messages).forEach(message => {
            if (message.senderId !== userId && !message.read) {
              totalUnread++;
            }
          });
        }
      });

      callback(totalUnread);
    });

    return unsubscribe;
  }
}

const chatService = new ChatService();
export default chatService;
