# 🤖 Sinep Group Bot

Telegram бот для компании Sinep Group - заказ IT услуг с поддержкой трех языков (украинский, русский, английский).

## 🛠 Настройка

### 1. Создайте файл `.env`
Создайте файл `.env` в корне проекта и добавьте:

```env
# Telegram Bot Token
BOT_TOKEN=ваш_telegram_bot_token

# Firebase Configuration
FIREBASE_API_KEY=ваш_api_key
FIREBASE_AUTH_DOMAIN=ваш_проект.firebaseapp.com
FIREBASE_PROJECT_ID=ваш_project_id
FIREBASE_STORAGE_BUCKET=ваш_проект.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
FIREBASE_APP_ID=ваш_app_id
```

### 2. Настройка Firebase
1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в **Firestore Database**
4. Создайте базу данных в тестовом режиме
5. Скопируйте конфигурацию из **Project Settings → General → Your apps**

### 3. Telegram Bot Token
1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте полученный токен в `.env`

## 🚀 Запуск

### Через Docker (рекомендуется):

```bash
# Сборка и запуск
docker-compose up --build -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Локально:

```bash
# Установка зависимостей
npm install

# Запуск
npm start
```

## 📋 Возможности бота

- 🌍 Поддержка 3 языков (украинский, русский, английский)
- 📱 Сбор контактных данных
- 🛍️ Заказ услуг:
    - 🎯 Таргетированная реклама
    - 🌐 Разработка сайтов
    - 🤖 Telegram боты
    - 🎨 UI/UX дизайн
- 💰 Выбор бюджета
- 📊 Сохранение данных в Firebase


Автор: Denis Bogoslovskiy