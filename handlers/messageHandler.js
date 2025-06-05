import { t } from '../utils/translations.js';
import { getPhoneKeyboard, getMainMenuKeyboard, getServicesKeyboard, getInfoKeyboard } from '../utils/keyboards.js';
import { USER_STATES, DEFAULT_LANGUAGE } from '../utils/constants.js';

export const handleMessage = async (bot, msg, userService, userStates, userLanguages, userServices) => {
    if (msg.text && !msg.text.startsWith('/') && !msg.contact) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text;
        const userState = userStates.get(userId);

        if (userState === USER_STATES.CUSTOM_BUDGET_INPUT) {
            await handleCustomBudgetInput(bot, msg, userService, userStates, userLanguages, userServices);
            return;
        }

        if (userState === USER_STATES.PHONE_REQUEST) {
            // Если пользователь не поделился номером телефона, напоминаем об этом
            bot.sendMessage(chatId, t(userId, 'phoneRequest', userLanguages), getPhoneKeyboard(userId, userLanguages));
            return;
        }

        if (!userLanguages.has(userId) || userState === USER_STATES.LANGUAGE_SELECTION) {
            await handleLanguageSetup(bot, msg, userLanguages);
            return;
        }

        if (userState === USER_STATES.MAIN_MENU) {
            await handleMainMenuActions(bot, msg, userStates, userLanguages);
        }
    }
};

const handleCustomBudgetInput = async (bot, msg, userService, userStates, userLanguages, userServices) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    const selectedUserService = userServices.get(userId);

    if (!selectedUserService) {
        console.error('❌ Не найдена выбранная услуга для пользователя', userId);
        bot.sendMessage(chatId, 'Ошибка: услуга не выбрана. Попробуйте начать заново с /start');
        return;
    }

    // Сохраняем заказ с пользовательским бюджетом
    try {
        const orderData = {
            userId: userId,
            service: selectedUserService.type,
            serviceName: selectedUserService.name,
            budget: text,
            timestamp: new Date().toISOString()
        };

        console.log('Сохранение заказа с пользовательским бюджетом:', orderData);

        const saveResult = await userService.saveOrder(orderData);
        if (saveResult.success) {
            console.log(`✅ Заказ с пользовательским бюджетом сохранен для пользователя ${userId}`);
        } else {
            console.error('❌ Ошибка при сохранении заказа:', saveResult.error);
        }
    } catch (error) {
        console.error('❌ Критическая ошибка сохранения заказа:', error.message);
    }

    bot.sendMessage(chatId, t(userId, 'budgetReceived', userLanguages, selectedUserService.name, text));
    userStates.set(userId, USER_STATES.MAIN_MENU);

    // Убираем отправку сообщения "Головне меню"
    // setTimeout(() => {
    //     bot.sendMessage(chatId, t(userId, 'mainMenu', userLanguages), getMainMenuKeyboard(userId, userLanguages));
    // }, 2000);
};

const handleLanguageSetup = async (bot, msg, userLanguages) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'Пользователь';

    const defaultLang = msg.from.language_code === 'ru' ? 'ru' :
        msg.from.language_code === 'en' ? 'en' : DEFAULT_LANGUAGE;
    userLanguages.set(userId, defaultLang);

    const { getLanguageKeyboard } = await import('../utils/keyboards.js');
    bot.sendMessage(chatId, t(userId, 'welcome', userLanguages, firstName), getLanguageKeyboard());
};

const handleMainMenuActions = async (bot, msg, userStates, userLanguages) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    if (text === t(userId, 'orderService', userLanguages)) {
        userStates.set(userId, USER_STATES.SERVICE_SELECTION);
        bot.sendMessage(chatId, t(userId, 'selectService', userLanguages), getServicesKeyboard(userId, userLanguages));
    }
    else if (text === t(userId, 'information', userLanguages)) {
        bot.sendMessage(chatId, t(userId, 'aboutUs', userLanguages), getInfoKeyboard(userId, userLanguages));
    }
    else if (text === t(userId, 'contactManager', userLanguages)) {
        bot.sendMessage(chatId, t(userId, 'contactInfo', userLanguages));
    }
};