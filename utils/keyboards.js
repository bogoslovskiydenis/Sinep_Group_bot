import { t } from './translations.js';

export const getLanguageKeyboard = () => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: '🇺🇦 Українська', callback_data: 'lang_uk' }],
            [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
            [{ text: '🇬🇧 English', callback_data: 'lang_en' }]
        ]
    }
});

export const getPhoneKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        keyboard: [
            [{ text: t(userId, 'phoneNumber', userLanguages), request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
});

export const getMainMenuKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        keyboard: [
            [t(userId, 'orderService', userLanguages)],
            [t(userId, 'information', userLanguages), t(userId, 'contactManager', userLanguages)]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
});

export const getServicesKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: t(userId, 'targetedAds', userLanguages), callback_data: 'service_ads' }],
            [{ text: t(userId, 'webDevelopment', userLanguages), callback_data: 'service_web' }],
            [{ text: t(userId, 'telegramBot', userLanguages), callback_data: 'service_bot' }],
            [{ text: t(userId, 'uiuxDesign', userLanguages), callback_data: 'service_design' }],
            [{ text: t(userId, 'backToMenu', userLanguages), callback_data: 'back_to_menu' }]
        ]
    }
});

export const getBudgetKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: t(userId, 'budget1', userLanguages), callback_data: 'budget_1' }],
            [{ text: t(userId, 'budget2', userLanguages), callback_data: 'budget_2' }],
            [{ text: t(userId, 'budget3', userLanguages), callback_data: 'budget_3' }],
            [{ text: t(userId, 'budget4', userLanguages), callback_data: 'budget_4' }],
            [{ text: t(userId, 'budget5', userLanguages), callback_data: 'budget_5' }],
            [{ text: t(userId, 'budgetOther', userLanguages), callback_data: 'budget_other' }],
            [{ text: t(userId, 'backToServices', userLanguages), callback_data: 'back_to_services' }]
        ]
    }
});

export const getInfoKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: t(userId, 'contactManager', userLanguages), callback_data: 'contact_info' }],
            [{ text: t(userId, 'backToMenu', userLanguages), callback_data: 'back_to_menu' }]
        ]
    }
});

export const getBackToMenuKeyboard = (userId, userLanguages) => ({
    reply_markup: {
        inline_keyboard: [
            [{ text: t(userId, 'backToMenu', userLanguages), callback_data: 'back_to_menu' }]
        ]
    }
});