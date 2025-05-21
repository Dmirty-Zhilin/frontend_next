const express = require('express');
const router = express.Router();

// Страница отчетов
router.get('/', (req, res) => {
  // В реальном приложении здесь будет получение списка отчетов из API бэкенда
  const reports = [
    {
      id: 'report-001',
      name: 'Анализ дропов от 20.05.2025',
      date: '2025-05-20T14:30:00Z',
      totalDomains: 1000,
      recommendedDomains: 342,
      status: 'completed'
    },
    {
      id: 'report-002',
      name: 'Долгоживущие домены',
      date: '2025-05-18T10:15:00Z',
      totalDomains: 500,
      recommendedDomains: 125,
      status: 'completed'
    },
    {
      id: 'report-003',
      name: 'Тестовый анализ',
      date: '2025-05-15T09:45:00Z',
      totalDomains: 100,
      recommendedDomains: 35,
      status: 'completed'
    }
  ];
  
  res.render('reports', {
    title: 'Отчеты',
    description: 'Список всех отчетов по анализу доменов',
    reports: reports
  });
});

// Просмотр отчета
router.get('/:reportId', (req, res) => {
  const reportId = req.params.reportId;
  
  // В реальном приложении здесь будет получение данных отчета из API бэкенда
  const report = {
    id: reportId,
    name: 'Анализ дропов от 20.05.2025',
    date: '2025-05-20T14:30:00Z',
    totalDomains: 1000,
    recommendedDomains: 342,
    analysisParams: {
      matchType: 'prefix',
      collapse: 'timestamp:4',
      limit: 1000,
      concurrency: 10
    }
  };
  
  res.render('report-view', {
    title: report.name,
    description: `Детальный просмотр отчета ${report.name}`,
    report: report
  });
});

// Получение данных отчета для таблицы
router.get('/:reportId/data', (req, res) => {
  const reportId = req.params.reportId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const sort = req.query.sort || 'domain';
  const order = req.query.order || 'asc';
  const filter = req.query.filter || '';
  
  // В реальном приложении здесь будет получение данных из API бэкенда с пагинацией и фильтрацией
  // Имитируем данные из Excel-отчета
  const reportData = {
    total: 1000,
    page: page,
    limit: limit,
    totalPages: Math.ceil(1000 / limit),
    data: [
      {
        domain: 'example.com',
        has_snapshot: true,
        total_snapshots: 621,
        timemap_count: 116,
        first_snapshot: '2001-03-02T04:17:21Z',
        last_snapshot: '2025-02-12T08:21:59Z',
        avg_interval_days: 13.96,
        max_gap_days: 1651,
        years_covered: 19,
        snapshots_per_year: {
          '2001': 51, '2002': 38, '2003': 47, '2004': 53, '2005': 42,
          '2006': 27, '2007': 21, '2008': 21, '2009': 12, '2010': 12,
          '2011': 3, '2012': 1, '2013': 11, '2014': 2, '2017': 1,
          '2018': 3, '2019': 1, '2024': 258, '2025': 17
        },
        unique_versions: 554,
        is_good: false,
        recommended: true,
        analysis_time_sec: 3.66
      },
      {
        domain: 'test-domain.org',
        has_snapshot: true,
        total_snapshots: 123,
        timemap_count: 16,
        first_snapshot: '2021-12-06T01:09:01Z',
        last_snapshot: '2025-02-07T20:07:38Z',
        avg_interval_days: 9.39,
        max_gap_days: 314,
        years_covered: 5,
        snapshots_per_year: {
          '2021': 2, '2022': 90, '2023': 28, '2024': 2, '2025': 1
        },
        unique_versions: 90,
        is_good: true,
        recommended: false,
        analysis_time_sec: 2.41
      }
    ]
  };
  
  res.json(reportData);
});

// Получение данных для графиков отчета
router.get('/:reportId/chart-data', (req, res) => {
  const reportId = req.params.reportId;
  const chartType = req.query.type || 'snapshots-by-year';
  
  // В реальном приложении здесь будет получение данных из API бэкенда
  let chartData = {};
  
  if (chartType === 'snapshots-by-year') {
    chartData = {
      labels: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2017', '2018', '2019', '2024', '2025'],
      datasets: [{
        label: 'Количество снимков',
        data: [51, 38, 47, 53, 42, 27, 21, 21, 12, 12, 3, 1, 11, 2, 1, 3, 1, 258, 17],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }]
    };
  } else if (chartType === 'interval-distribution') {
    chartData = {
      labels: ['<1 день', '1-7 дней', '7-30 дней', '30-90 дней', '>90 дней'],
      datasets: [{
        label: 'Количество доменов',
        data: [150, 420, 280, 100, 50],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }]
    };
  } else if (chartType === 'recommendations') {
    chartData = {
      labels: ['Рекомендовано', 'Не рекомендовано'],
      datasets: [{
        data: [342, 658],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }]
    };
  }
  
  res.json(chartData);
});

// Экспорт отчета
router.get('/:reportId/export/:format', (req, res) => {
  const reportId = req.params.reportId;
  const format = req.params.format;
  
  // В реальном приложении здесь будет генерация и отправка файла отчета
  // Для демонстрации просто перенаправляем на страницу отчета
  res.redirect(`/reports/${reportId}`);
});

module.exports = router;
