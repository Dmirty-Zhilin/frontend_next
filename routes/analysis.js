const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Только текстовые файлы и CSV'), false);
    }
  }
});

// Страница анализа
router.get('/', (req, res) => {
  res.render('analysis', {
    title: 'Анализ доменов',
    description: 'Запуск и настройка анализа дроп-доменов',
    analysisOptions: {
      matchTypes: ['prefix', 'host', 'exact'],
      collapseOptions: ['timestamp:4', 'digest', 'none'],
      limitOptions: [100, 500, 1000, 5000, 10000],
      concurrencyOptions: [5, 10, 20, 50]
    }
  });
});

// Запуск нового анализа
router.post('/start', upload.single('domains'), (req, res) => {
  // В реальном приложении здесь будет отправка запроса к API бэкенда
  const analysisParams = {
    matchType: req.body.matchType || 'prefix',
    collapse: req.body.collapse || 'none',
    limit: parseInt(req.body.limit) || 1000,
    concurrency: parseInt(req.body.concurrency) || 10,
    clickhouse: req.body.clickhouse === 'on',
    verbose: req.body.verbose === 'on',
    filename: req.file ? req.file.filename : null
  };
  
  // Создаем задачу анализа и возвращаем её ID
  const taskId = `task-${Date.now()}`;
  
  res.redirect(`/analysis/status/${taskId}`);
});

// Страница статуса анализа
router.get('/status/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  
  // В реальном приложении здесь будет получение статуса задачи из API бэкенда
  const taskStatus = {
    id: taskId,
    status: 'processing', // processing, completed, failed
    progress: 65,
    startTime: new Date(Date.now() - 120000).toISOString(), // 2 минуты назад
    estimatedCompletion: new Date(Date.now() + 60000).toISOString(), // через 1 минуту
    domainsProcessed: 650,
    totalDomains: 1000,
    currentSpeed: '5.4 domains/sec'
  };
  
  res.render('task-status', {
    title: 'Статус анализа',
    description: `Отслеживание прогресса задачи ${taskId}`,
    task: taskStatus
  });
});

// API для получения обновлений статуса задачи
router.get('/status/:taskId/updates', (req, res) => {
  const taskId = req.params.taskId;
  
  // В реальном приложении здесь будет получение обновлений из API бэкенда
  const taskUpdate = {
    id: taskId,
    status: 'processing',
    progress: 65,
    domainsProcessed: 650,
    totalDomains: 1000,
    currentSpeed: '5.4 domains/sec',
    recentResults: [
      { domain: 'example.com', status: 'analyzed', recommended: true },
      { domain: 'test-domain.org', status: 'analyzed', recommended: false },
      { domain: 'another-site.net', status: 'analyzed', recommended: true }
    ]
  };
  
  res.json(taskUpdate);
});

// Отмена задачи анализа
router.post('/status/:taskId/cancel', (req, res) => {
  const taskId = req.params.taskId;
  
  // В реальном приложении здесь будет отправка запроса на отмену задачи к API бэкенда
  
  res.redirect('/dashboard');
});

module.exports = router;
