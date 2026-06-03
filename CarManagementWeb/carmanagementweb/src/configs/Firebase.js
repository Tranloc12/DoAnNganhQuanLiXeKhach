import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, onMessage } from "firebase/messaging"; 



const firebaseConfig = { 
  apiKey : "AIzaSyBH8ypW8EAE4BNhkj3Hb-LnCa1g0o3e_5s" , 
  authDomain : "carmangament.firebaseapp.com" , 
  projectId : "carmangament" , 
  storageBucket : "carmangament.firebasestorage.app" , 
  messagingSenderId : "989954131234" , 
  appId : "1:989954131234:web:f7fa0a9cf05dc5decad17b" , 
  measurementId : "G-FBR94DX8J4" ,
  databaseURL: "https://carmangament-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// 🎯 Khởi tạo Messaging và lấy tham chiếu đến service
export const messaging = getMessaging(app); // Export để sử dụng ở các component khác

export default app;
