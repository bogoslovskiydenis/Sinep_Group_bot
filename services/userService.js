import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';

class UserService {
    // Сохранить пользователя в Firebase
    async saveUser(userData) {
        try {
            const userRef = doc(db, 'users', userData.id.toString());

            const userDoc = {
                id: userData.id,
                username: userData.username || null,
                first_name: userData.first_name,
                language_code: userData.language_code || null,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            };

            await setDoc(userRef, userDoc, { merge: true });

            console.log(`✅ Пользователь ${userData.first_name} (${userData.id}) сохранен в Firebase`);
            return { success: true, data: userDoc };

        } catch (error) {
            console.error('❌ Ошибка сохранения пользователя:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Получить пользователя из Firebase если нужно будет
    async getUser(userId) {
        try {
            const userRef = doc(db, 'users', userId.toString());
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                console.log(`📖 Пользователь ${userId} найден в Firebase`);
                return { success: true, data: userSnap.data() };
            } else {
                console.log(`❓ Пользователь ${userId} не найден в Firebase`);
                return { success: false, error: 'Пользователь не найден' };
            }

        } catch (error) {
            console.error('❌ Ошибка получения пользователя:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export default UserService;