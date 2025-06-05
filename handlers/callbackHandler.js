import { t } from '../utils/translations.js';
import {
    getPhoneKeyboard,
    getMainMenuKeyboard,
    getBudgetKeyboard,
    getServicesKeyboard,
    getBackToMenuKeyboard
} from '../utils/keyboards.js';
import { USER_STATES, CALLBACK_DATA } from '../utils/constants.js';

export const handleCallbackQuery = async (bot, query, userService, userStates, userLanguages, userServices) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;

    try {
        // Обработка выбора языка
        if (data.startsWith(CALLBACK_DATA.LANG_PREFIX)) {
            await handleLanguageSelection(bot, query, userService, userStates, userLanguages);
        }
        // Обработка выбора услуг
        else if (data.startsWith(CALLBACK_DATA.SERVICE_PREFIX)) {
            await handleServiceSelection(bot, query, userStates, userLanguages, userServices);
        }
        // Обработка выбора бюджета
        else if (data.startsWith(CALLBACK_DATA.BUDGET_PREFIX)) {
            await handleBudgetSelection(bot, query, userService, userStates, userLanguages, userServices);
        }
        // Навигация
        else if (data === CALLBACK_DATA.BACK_TO_MENU) {
            await handleBackToMenu(bot, query, userStates, userLanguages);
        }
        else if (data === CALLBACK_DATA.BACK_TO_SERVICES) {
            await handleBackToServices(bot, query, userStates, userLanguages);
        }
        else if (data === CALLBACK_DATA.CONTACT_INFO) {
            await handleContactInfo(bot, query, userLanguages);
        }

        await bot.answerCallbackQuery(query.id);
    } catch (error) {
        console.error('❌ Ошибка при обработке callback:', error.message);
        await bot.answerCallbackQuery(query.id, { text: 'Произошла ошибка' });
    }
};

const handleLanguageSelection = async (bot, query, userService, userStates, userLanguages) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const lang = query.data.split('_')[1];

    userLanguages.set(userId, lang);

    // Сохраняем выбранный язык в базе данных
    try {
        const updateResult = await userService.updateUserLanguage(userId, lang);
        if (updateResult.success) {
            console.log(`✅ Язык ${lang} сохранен для пользователя ${userId}`);
        } else {
            console.error(`❌ Ошибка сохранения языка:`, updateResult.error);
        }
    } catch (error) {
        console.error('❌ Критическая ошибка при сохранении языка:', error.message);
    }

    await bot.editMessageText(
        t(userId, 'languageSelected', userLanguages),
        {
            chat_id: chatId,
            message_id: query.message.message_id
        }
    );

    // Переводим пользователя в состояние запроса телефона
    userStates.set(userId, USER_STATES.PHONE_REQUEST);

    setTimeout(() => {
        bot.sendMessage(chatId, t(userId, 'phoneRequest', userLanguages), getPhoneKeyboard(userId, userLanguages));
    }, 1000);
};

const handleServiceSelection = async (bot, query, userStates, userLanguages, userServices) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const service = query.data.split('_')[1];

    const serviceNames = {
        'ads': t(userId, 'targetedAds', userLanguages),
        'web': t(userId, 'webDevelopment', userLanguages),
        'bot': t(userId, 'telegramBot', userLanguages),
        'design': t(userId, 'uiuxDesign', userLanguages)
    };

    // Сохраняем выбранную услугу
    userServices.set(userId, {
        type: service,
        name: serviceNames[service]
    });

    // Переводим в состояние выбора бюджета
    userStates.set(userId, USER_STATES.BUDGET_REQUEST);

    await bot.editMessageText(
        `${serviceNames[service]}\n\n${t(userId, 'budgetQuestion', userLanguages)}`,
        {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: getBudgetKeyboard(userId, userLanguages).reply_markup
        }
    );
};

const handleBudgetSelection = async (bot, query, userService, userStates, userLanguages, userServices) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const budgetType = query.data.split('_')[1];
    const selectedUserService = userServices.get(userId);

    if (!selectedUserService) {
        console.error('❌ Не найдена выбранная услуга для пользователя', userId);
        await bot.answerCallbackQuery(query.id, { text: 'Ошибка: услуга не выбрана' });
        return;
    }

    if (budgetType === 'other') {
        // Запрашиваем ввод пользовательского бюджета
        await bot.editMessageText(
            t(userId, 'enterCustomBudget', userLanguages),
            {
                chat_id: chatId,
                message_id: query.message.message_id
            }
        );
        userStates.set(userId, USER_STATES.CUSTOM_BUDGET_INPUT);
    } else {
        const budgetTexts = {
            '1': t(userId, 'budget1', userLanguages),
            '2': t(userId, 'budget2', userLanguages),
            '3': t(userId, 'budget3', userLanguages),
            '4': t(userId, 'budget4', userLanguages),
            '5': t(userId, 'budget5', userLanguages)
        };

        const budgetText = budgetTexts[budgetType];
        await saveOrderAndRespond(bot, query, userService, userStates, userLanguages, selectedUserService, budgetText);
    }
};

const saveOrderAndRespond = async (bot, query, userService, userStates, userLanguages, selectedUserService, budgetText) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;

    // Сохраняем заказ в базе данных
    try {
        const orderData = {
            userId: userId,
            service: selectedUserService.type,
            serviceName: selectedUserService.name,
            budget: budgetText,
            timestamp: new Date().toISOString()
        };

        console.log('📝 Сохранение заказа:', orderData);

        const saveResult = await userService.saveOrder(orderData);
        if (saveResult.success) {
            console.log(`✅ Заказ сохранен для пользователя ${userId}`);
        } else {
            console.error('❌ Ошибка при сохранении заказа:', saveResult.error);
        }
    } catch (error) {
        console.error('❌ Критическая ошибка сохранения заказа:', error.message);
    }

    await bot.editMessageText(
        t(userId, 'budgetReceived', userLanguages, selectedUserService.name, budgetText),
        {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        }
    );

    // Возвращаем в главное меню БЕЗ отправки сообщения "Головне меню"
    userStates.set(userId, USER_STATES.MAIN_MENU);

    // Убираем отправку сообщения "Головне меню"
    // setTimeout(() => {
    //     bot.sendMessage(chatId, t(userId, 'mainMenu', userLanguages), getMainMenuKeyboard(userId, userLanguages));
    // }, 2000);
};

const handleBackToMenu = async (bot, query, userStates, userLanguages) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;

    await bot.deleteMessage(chatId, query.message.message_id);
    userStates.set(userId, USER_STATES.MAIN_MENU);
    bot.sendMessage(chatId, t(userId, 'mainMenu', userLanguages), getMainMenuKeyboard(userId, userLanguages));
};

const handleBackToServices = async (bot, query, userStates, userLanguages) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;

    userStates.set(userId, USER_STATES.SERVICE_SELECTION);
    await bot.editMessageText(
        t(userId, 'selectService', userLanguages),
        {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: getServicesKeyboard(userId, userLanguages).reply_markup
        }
    );
};

const handleContactInfo = async (bot, query, userLanguages) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;

    await bot.editMessageText(
        t(userId, 'contactInfo', userLanguages),
        {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: getBackToMenuKeyboard(userId, userLanguages).reply_markup
        }
    );
};

export { saveOrderAndRespond };