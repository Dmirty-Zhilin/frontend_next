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

# Установка переменных окружения
ENV NODE_ENV=production
ENV PORT=3060
ENV API_URL=http://n4os8008kscckw0k4wwk8k48.45.155.207.218.sslip.io

# Открытие порта
EXPOSE 3060

# Запуск приложения
CMD ["node", "app.js"]
