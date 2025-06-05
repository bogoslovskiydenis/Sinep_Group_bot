import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import {setupErrorHandlers} from "./utils/errorHandler.js";

dotenv.config();

// Проверяем наличие токена
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('❌ BOT_TOKEN не найден');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Запустили Бот');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Пользователь';

    console.log(`Пользователь ${firstName} (ID: ${msg.from.id}) запустил бота`);

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

console.log('Бот запущен');