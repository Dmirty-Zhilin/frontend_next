const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
  res.render('index', { title: 'Анализатор дропов' });
});

// Статическая версия (SPA)
router.get('/static', (req, res) => {
  res.render('static', { title: 'Анализатор дропов - Статическая версия' });
});

module.exports = router;Главная',
    description: 'Современный инструмент для анализа дроп-доменов через Wayback Machine'
  });
});

// Страница о проекте
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'О проекте',
    description: 'Информация о проекте анализатора дропов'
  });
});

// Переключение темы
router.post('/theme/toggle', (req, res) => {
  const currentTheme = req.cookies.theme || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  res.cookie('theme', newTheme, { 
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 год
    httpOnly: true 
  });
  
  res.redirect(req.headers.referer || '/');
});

module.exports = router;
