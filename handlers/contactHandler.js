import { t } from '../utils/translations.js';
import { getMainMenuKeyboard } from '../utils/keyboards.js';
import { USER_STATES } from '../utils/constants.js';

export const handleContact = async (bot, msg, userService, userStates, userLanguages) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const contact = msg.contact;
    const userState = userStates.get(userId);

    try {
        // Сохраняем контакт пользователя
        const contactData = {
            userId: userId,
            phoneNumber: contact.phone_number,
            firstName: contact.first_name,
            lastName: contact.last_name,
            timestamp: new Date().toISOString()
        };

        // Сохраняем номер телефона в базе данных
        const saveResult = await userService.saveUserContact(contactData);
        if (saveResult.success) {
            console.log(`✅ Контакт сохранен для пользователя ${userId}`);
        } else {
            console.error('❌ Ошибка сохранения контакта:', saveResult.error);
        }

        if (userState === USER_STATES.PHONE_REQUEST) {
            bot.sendMessage(chatId, t(userId, 'phoneReceived', userLanguages));
            userStates.set(userId, USER_STATES.MAIN_MENU);

            setTimeout(() => {
                bot.sendMessage(chatId, t(userId, 'mainMenu', userLanguages), getMainMenuKeyboard(userId, userLanguages));
            }, 1000);
        } else {
            // Если это запрос контакта после выбора услуги
            bot.sendMessage(chatId, t(userId, 'thankYou', userLanguages), getMainMenuKeyboard(userId, userLanguages));
            userStates.set(userId, USER_STATES.MAIN_MENU);
        }
    } catch (error) {
        console.error('❌ Ошибка при обработке контакта:', error.message);
    }
};