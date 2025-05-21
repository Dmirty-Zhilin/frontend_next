require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');
// Импорт маршрутов
const indexRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard');
const analysisRoutes = require('./routes/analysis');
const reportsRoutes = require('./routes/reports');
const aiAgentsRoutes = require('./routes/ai-agents');
const domainsRoutes = require('./routes/api/domains');
const app = express();
// Настройка порта
const PORT = process.env.PORT || 3060;
// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com", process.env.API_URL || "http://localhost:8005"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'drop-analyzer-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Статические файлы с абсолютными путями и правильными MIME-типами
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, path, stat) {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
    } else if (path.endsWith('.woff')) {
      res.set('Content-Type', 'font/woff');
    } else if (path.endsWith('.woff2')) {
      res.set('Content-Type', 'font/woff2');
    } else if (path.endsWith('.ttf')) {
      res.set('Content-Type', 'font/ttf');
    } else if (path.endsWith('.eot')) {
      res.set('Content-Type', 'application/vnd.ms-fontobject');
    }
  },
  maxAge: '1d', // Кэширование на 1 день
  etag: true,
  lastModified: true
}));

// Middleware для передачи переменных во все шаблоны
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.theme = req.cookies.theme || 'light';
  next();
});

// Тестовый маршрут для проверки стилей - ПЕРЕМЕЩЕНО ВЫШЕ других маршрутов
app.use('/test-styles', require('./routes/test-styles'));

// Маршруты
app.use('/', indexRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/analysis', analysisRoutes);
app.use('/reports', reportsRoutes);
app.use('/ai-agents', aiAgentsRoutes);
app.use('/api/domains', domainsRoutes);

// API маршруты
app.use('/api/analysis', require('./routes/api/analysis'));
app.use('/api/reports', require('./routes/api/reports'));
app.use('/api/ai-agents', require('./routes/api/ai-agents'));

// Обработка ошибок 404
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Страница не найдена',
    message: 'Запрашиваемая страница не существует',
    error: { status: 404 }
  });
});

// Обработка ошибок сервера
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Ошибка сервера',
    message: process.env.NODE_ENV === 'production' ? 'Произошла ошибка на сервере' : err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
