import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const requiredFields = ['FIREBASE_PROJECT_ID', 'FIREBASE_API_KEY'];
for (const field of requiredFields) {
    if (!process.env[field]) {
        console.error(`❌ ${field} не найден в переменных окружения`);
        process.exit(1);
    }
}

let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('✅ Firebase подключен');
} catch (error) {
    console.error('❌ Ошибка подключения к Firebase:', error.message);
    process.exit(1);
}

export { db };