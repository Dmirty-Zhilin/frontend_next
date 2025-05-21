# Инструкция по деплою фронтенда

## Требования
- Node.js >= 18.0.0
- npm >= 8.0.0

## Шаги по деплою

### 1. Клонирование репозитория
```bash
git clone https://github.com/Dmirty-Zhilin/frontend_next.git
cd frontend_next
```

### 2. Установка зависимостей
```bash
npm install
```

> **ВАЖНО**: Убедитесь, что все зависимости, включая `express-ejs-layouts`, установлены корректно. Проверьте наличие папки `node_modules` и файла `node_modules/express-ejs-layouts`.

### 3. Настройка переменных окружения
Создайте файл `.env` в корне проекта со следующими параметрами:
```
PORT=3060
NODE_ENV=production
BACKEND_URL=http://backend:8005
SESSION_SECRET=your-secret-key
```

### 4. Запуск приложения
```bash
npm start
```

## Деплой через Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Открытие порта
EXPOSE 3060

# Запуск приложения
CMD ["npm", "start"]
```

### Сборка и запуск Docker-контейнера
```bash
docker build -t frontend_next .
docker run -p 3060:3060 frontend_next
```

## Проверка деплоя

После запуска приложения проверьте следующие URL:
- Главная страница: http://localhost:3060/
- Дашборд: http://localhost:3060/dashboard
- Отчеты: http://localhost:3060/reports
- AI-агенты: http://localhost:3060/ai-agents

## Устранение неполадок

### Ошибка "Cannot find module 'express-ejs-layouts'"
Если вы видите эту ошибку, выполните следующие действия:
1. Убедитесь, что вы выполнили `npm install`
2. Проверьте, что модуль указан в package.json
3. Попробуйте установить модуль вручную: `npm install express-ejs-layouts --save`
4. Перезапустите приложение

### Ошибка "Cannot find module 'ejs'"
Аналогично, убедитесь, что модуль ejs установлен:
```bash
npm install ejs --save
```

### Проблемы с подключением к бэкенду
Убедитесь, что бэкенд запущен и доступен по указанному в .env URL. Бэкенд должен быть запущен на адресе 0.0.0.0 (не 127.0.0.1) для доступа извне контейнера.
