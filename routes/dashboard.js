const express = require('express');
const router = express.Router();

// Страница дашборда
router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'Панель управления',
    description: 'Обзор всех анализов и отчетов',
    stats: {
      totalDomains: 1250,
      analyzedDomains: 1120,
      recommendedDomains: 342,
      averageAnalysisTime: 3.5
    }
  });
});

// Получение данных для графиков дашборда
router.get('/chart-data', (req, res) => {
  // В реальном приложении эти данные будут получены из API бэкенда
  const chartData = {
    domainsByYear: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [{
        label: 'Количество доменов',
        data: [120, 250, 310, 280, 190, 100],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }]
    },
    recommendationStats: {
      labels: ['Рекомендовано', 'Не рекомендовано', 'Требует проверки'],
      datasets: [{
        data: [342, 658, 120],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(245, 158, 11, 0.6)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1
      }]
    },
    analysisTimeDistribution: {
      labels: ['<1с', '1-3с', '3-5с', '5-10с', '>10с'],
      datasets: [{
        label: 'Количество доменов',
        data: [150, 420, 280, 180, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }]
    }
  };
  
  res.json(chartData);
});

module.exports = router;
