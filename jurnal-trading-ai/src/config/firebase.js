import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAk8WhrmqYHmWvcLP5kWh9Fpskbk-7UwU8",
  authDomain: "jurnal-trading-ai.firebaseapp.com",
  projectId: "jurnal-trading-ai",
  storageBucket: "jurnal-trading-ai.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure auth persistence
auth.useDeviceLanguage();

export { auth, db, storage };
