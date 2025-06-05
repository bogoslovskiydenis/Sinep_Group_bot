import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

console.log('🔄 Инициализация UserService...');

class UserService {
    constructor() {
        this.usersCollection = 'users';

        if (!db) {
            console.error('❌ Firebase DB не инициализирован в UserService');
            throw new Error('Firebase DB не доступен');
        }

        console.log('✅ UserService успешно инициализирован');

        this.validateMethods();
    }

    validateMethods() {
        const methods = ['saveUser', 'getUser', 'updateUserLanguage', 'saveUserContact', 'saveOrder', 'getUserOrders', 'getStats'];

        for (const method of methods) {
            if (typeof this[method] !== 'function') {
                console.error(`Метод ${method} не найден в UserService`);
            } else {
                console.log(`Метод ${method} доступен`);
            }
        }
    }

    async saveUser(userData) {
        console.log('saveUser вызван с данными:', userData);
        try {
            const userRef = doc(db, this.usersCollection, userData.id.toString());

            const userDoc = {
                id: userData.id,
                username: userData.username || null,
                first_name: userData.first_name,
                language: null,
                phone_number: null,
                created_at: serverTimestamp(),

                last_service: null,
                last_service_name: null,
                last_budget: null,
                last_order_at: null,
                orders_count: 0
            };

            await setDoc(userRef, userDoc, { merge: true });

            console.log(`Пользователь ${userData.first_name} (${userData.id}) сохранен в Firebase`);
            return { success: true, data: userDoc };

        } catch (error) {
            console.error('Ошибка сохранения пользователя:', error.message);
            return { success: false, error: error.message };
        }
    }



    async updateUserLanguage(userId, language) {
        console.log('updateUserLanguage вызван:', { userId, language });
        try {
            const userRef = doc(db, this.usersCollection, userId.toString());

            await updateDoc(userRef, {
                language: language
            });

            console.log(`Язык ${language} обновлен для пользователя ${userId}`);
            return { success: true };
        } catch (error) {
            console.error('Ошибка при обновлении языка:', error.message);
            return { success: false, error: error.message };
        }
    }

    async saveUserContact(contactData) {
        console.log('saveUserContact вызван с данными:', contactData);
        try {
            const userRef = doc(db, this.usersCollection, contactData.userId.toString());
            await updateDoc(userRef, {
                phone_number: contactData.phoneNumber || null,
            });

            console.log(`Номер телефона сохранен для пользователя ${contactData.userId}`);
            return { success: true };
        } catch (error) {
            console.error('Ошибка при сохранении номера телефона:', error.message);
            return { success: false, error: error.message };
        }
    }

    async saveOrder(orderData) {
        console.log('saveOrder вызван с данными:', orderData);
        try {
            console.log(`Сохранение заказа для пользователя ${orderData.userId}:`, orderData);

            // Проверяем обязательные поля
            if (!orderData.userId) {
                throw new Error('userId обязателен для заказа');
            }

            const userRef = doc(db, this.usersCollection, orderData.userId.toString());

            // Получаем текущие данные пользователя
            const userSnap = await getDoc(userRef);
            const currentData = userSnap.exists() ? userSnap.data() : {};
            const currentOrdersCount = currentData.orders_count || 0;

            // Проверяем, есть ли уже услуги у пользователя
            let updatedServiceName = orderData.serviceName || '';

            if (currentData.last_service_name) {
                const existingServices = currentData.last_service_name.split(' | ');

                if (!existingServices.includes(orderData.serviceName)) {
                    updatedServiceName = currentData.last_service_name + ' | ' + orderData.serviceName;
                } else {
                    updatedServiceName = currentData.last_service_name;
                }
            }

            const orderUpdateData = {
                last_service: orderData.service || null,
                last_service_name: updatedServiceName,
                last_budget: orderData.budget || null,
                last_order_at: serverTimestamp(),
                orders_count: currentOrdersCount + 1,
                last_order_timestamp: orderData.timestamp || new Date().toISOString()
            };

            console.log('🧹 Данные для обновления пользователя:', orderUpdateData);

            await updateDoc(userRef, orderUpdateData);

            console.log(`✅ Заказ сохранен для пользователя ${orderData.userId}`);
            console.log(`Обновленные услуги: ${updatedServiceName}`);
            return { success: true, orderId: `${orderData.userId}_${Date.now()}` };
        } catch (error) {
            console.error('❌ Ошибка при сохранении заказа:', error.message);
            console.error('Stack trace:', error.stack);
            return { success: false, error: error.message };
        }
    }
}

export default UserService;