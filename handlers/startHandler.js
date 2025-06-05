import { t } from '../utils/translations.js';
import { getLanguageKeyboard } from '../utils/keyboards.js';
import { USER_STATES, DEFAULT_LANGUAGE } from '../utils/constants.js';

export const handleStart = async (bot, msg, userService, userStates, userLanguages) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'Пользователь';

    console.log(`Пользователь ${firstName} (ID: ${userId}) запустил бота`);

    // Сохраняем пользователя в Firebase
    try {
        const userData = {
            id: userId,
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

    userStates.set(userId, USER_STATES.LANGUAGE_SELECTION);

    const defaultLang = msg.from.language_code === 'ru' ? 'ru' :
        msg.from.language_code === 'en' ? 'en' : DEFAULT_LANGUAGE;

    if (!userLanguages.has(userId)) {
        userLanguages.set(userId, defaultLang);
    }

    const welcomeMessage = t(userId, 'welcome', userLanguages, firstName);
    bot.sendMessage(chatId, welcomeMessage, getLanguageKeyboard());
};