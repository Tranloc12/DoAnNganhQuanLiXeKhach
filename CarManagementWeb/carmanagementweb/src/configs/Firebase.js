import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: "AIzaSyBlb_6Qe-ZLFvamQIgu6-1s2NCf0s-3YjY",
//   authDomain: "gymcenter-19beb.firebaseapp.com",
//   databaseURL: "https://gymcenter-19beb-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "gymcenter-19beb",
//   storageBucket: "gymcenter-19beb.firebasestorage.app",
//   messagingSenderId: "453439380057",
//   appId: "1:453439380057:web:0a4bd9368cefd39d936f48"
// };


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

export default app;
