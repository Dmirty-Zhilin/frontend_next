FROM node:18-alpine

WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install --production

# Копирование остальных файлов проекта
COPY . .

# Создание директории для загрузок
RUN mkdir -p uploads && chmod 777 uploads

# Сборка React-компонентов (если они есть)
RUN npm run build || echo "Пропуск сборки, если скрипт не определен"

# Установка переменных окружения
ENV NODE_ENV=production
ENV PORT=3060
ENV API_URL=http://backend:8005

# Открытие порта
EXPOSE 3060

# Проверка соединения с бэкендом при запуске
CMD ["node", "-e", "const http = require('http'); const apiUrl = process.env.API_URL; console.log(`Проверка соединения с бэкендом: ${apiUrl}`); const [protocol, host] = apiUrl.split('://'); const [hostname, port] = (host || '').split(':'); if (!hostname) { console.error('Некорректный URL бэкенда. Запуск приложения...'); process.exit(0); } const req = http.get(apiUrl, (res) => { console.log(`Соединение с бэкендом установлено. Статус: ${res.statusCode}`); process.exit(0); }).on('error', (err) => { console.warn(`Предупреждение: не удалось соединиться с бэкендом (${err.message}). Приложение будет запущено, но некоторые функции могут быть недоступны.`); process.exit(0); }); req.setTimeout(5000, () => { req.destroy(); console.warn('Предупреждение: таймаут соединения с бэкендом. Приложение будет запущено, но некоторые функции могут быть недоступны.'); process.exit(0); });", "&&", "node", "app.js"]
