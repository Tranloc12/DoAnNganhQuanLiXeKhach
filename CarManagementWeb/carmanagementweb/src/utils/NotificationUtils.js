class NotificationUtils {
  constructor() {
    this.originalTitle = document.title;
    this.isBlinking = false;
    this.blinkInterval = null;
  }

  // Hiển thị notification trong browser
  showBrowserNotification(title, body, icon = null) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          tag: 'gym-chat'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body,
              icon: icon || '/favicon.ico',
              tag: 'gym-chat'
            });
          }
        });
      }
    }
  }

  // Phát âm thanh thông báo
  playNotificationSound() {
    try {
      // Tạo âm thanh đơn giản bằng Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  // Làm nhấp nháy title
  startTitleBlink(newTitle) {
    if (this.isBlinking) return;

    this.isBlinking = true;
    let isOriginal = true;

    this.blinkInterval = setInterval(() => {
      document.title = isOriginal ? newTitle : this.originalTitle;
      isOriginal = !isOriginal;
    }, 1000);
  }

  // Dừng nhấp nháy title
  stopTitleBlink() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
    this.isBlinking = false;
    document.title = this.originalTitle;
  }

  // Thông báo tin nhắn mới
  notifyNewMessage(senderName, message, isWindowFocused = false) {
    // Chỉ hiển thị notification khi window không được focus
    if (!isWindowFocused) {
      this.showBrowserNotification(
        `Tin nhắn mới từ ${senderName}`,
        message.length > 50 ? message.substring(0, 50) + '...' : message
      );

      this.playNotificationSound();

      this.startTitleBlink(`💬 Tin nhắn mới từ ${senderName}`);
    }
  }

  // Reset notifications khi user focus vào window
  resetNotifications() {
    this.stopTitleBlink();
  }

  // Request permission cho notifications
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }
}

export default new NotificationUtils();
