function handleBotError(error, type = 'общая') {
    console.error(`❌ Ошибка ${type}:`, error.message);

    if (error.code) {
        console.error(`Код ошибки: ${error.code}`);
    }

    if (error.response) {
        console.error(`Ответ сервера:`, error.response.body);
    }

    if (type === 'polling' && error.code === 'FATAL') {
        console.log(' Критическая ошибка polling.');
    }

    console.error(`Время ошибки: ${new Date().toLocaleString()}`);
}

function setupErrorHandlers(bot) {
    bot.on('error', (error) => handleBotError(error, 'бота'));
    bot.on('polling_error', (error) => handleBotError(error, 'polling'));
}

export { handleBotError, setupErrorHandlers };