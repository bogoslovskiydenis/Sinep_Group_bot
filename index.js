import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import {setupErrorHandlers} from "./utils/errorHandler.js";
import UserService from './services/userService.js';
import {handleCallbackQuery} from './handlers/callbackHandler.js';
import {handleContact} from './handlers/contactHandler.js';
import {handleMessage} from './handlers/messageHandler.js';
import {handleStart} from "./handlers/startHandler.js";

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('❌ BOT_TOKEN не найден');
    process.exit(1);
}

const bot = new TelegramBot(token, {polling: true});

let userService;
try {
    userService = new UserService();
    console.log('✅ UserService инициализирован');
} catch (error) {
    console.error('❌ Ошибка инициализации UserService:', error.message);
    process.exit(1);
}

const userLanguages = new Map();
const userStates = new Map();
const userServices = new Map();

bot.onText(/\/start/, async (msg) => {
    await handleStart(bot, msg, userService, userStates, userLanguages);
});

bot.on('callback_query', async (query) => {
    await handleCallbackQuery(bot, query, userService, userStates, userLanguages, userServices);
});

bot.on('contact', async (msg) => {
    await handleContact(bot, msg, userService, userStates, userLanguages);
});

bot.on('message', async (msg) => {
    await handleMessage(bot, msg, userService, userStates, userLanguages, userServices);
});

setupErrorHandlers(bot);

console.log('🚀 Sinep Group Bot запущен успешно!');
