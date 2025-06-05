import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import {setupErrorHandlers} from "./utils/errorHandler.js";
import UserService from './services/userService.js';

dotenv.config();

// Проверяем наличие токена
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('❌ BOT_TOKEN не найден');
    process.exit(1);
}

const bot = new TelegramBot(token, {polling: true});
const userService = new UserService();


bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Пользователь';

    console.log(`👤 Пользователь ${firstName} (ID: ${msg.from.id}) запустил бота`);

    // Сохраняем пользователя в Firebase
    try {
        const userData = {
            id: msg.from.id,
            username: msg.from.username,
            first_name: msg.from.first_name,
            language_code: msg.from.language_code,
        };

        const result = await userService.saveUser(userData);

        if (result.success) {
            console.log(`✅ Пользователь ${firstName} успешно сохранен в Firebase`);
        } else {
            console.error(`❌ Ошибка сохранения пользователя ${firstName}:`, result.error);
        }
    } catch (error) {
        console.error('❌ Критическая ошибка при сохранении пользователя:', error.message);
    }

    const welcomeMessage = `
Привет, ${firstName}! 👋
Добро пожаловать в Sinep Group Bot!

Выберите язык интерфейса:
🇺🇦 Українська
🇷🇺 Русский  
🇬🇧 English
  `;

    bot.sendMessage(chatId, welcomeMessage);
});

setupErrorHandlers(bot);

console.log('✅ Бот запущен');