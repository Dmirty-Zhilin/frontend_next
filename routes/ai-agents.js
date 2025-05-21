const express = require('express');
const router = express.Router();

// Страница AI-агентов
router.get('/', (req, res) => {
  // В реальном приложении здесь будет получение списка AI-агентов из API бэкенда
  const agents = [
    {
      id: 'agent-001',
      name: 'Анализатор качества доменов',
      description: 'Оценивает качество доменов на основе исторических данных',
      status: 'active',
      lastTrained: '2025-05-15T10:30:00Z',
      accuracy: 0.92
    },
    {
      id: 'agent-002',
      name: 'Предиктор стоимости',
      description: 'Прогнозирует потенциальную стоимость домена',
      status: 'active',
      lastTrained: '2025-05-10T14:45:00Z',
      accuracy: 0.85
    },
    {
      id: 'agent-003',
      name: 'Классификатор тематики',
      description: 'Определяет тематику домена на основе исторического контента',
      status: 'training',
      lastTrained: '2025-05-01T09:15:00Z',
      accuracy: 0.78
    }
  ];
  
  res.render('ai-agents', {
    title: 'AI-агенты',
    description: 'Управление и настройка AI-агентов для анализа доменов',
    agents: agents
  });
});

// Страница настройки AI-агента
router.get('/:agentId', (req, res) => {
  const agentId = req.params.agentId;
  
  // В реальном приложении здесь будет получение данных агента из API бэкенда
  const agent = {
    id: agentId,
    name: 'Анализатор качества доменов',
    description: 'Оценивает качество доменов на основе исторических данных',
    status: 'active',
    lastTrained: '2025-05-15T10:30:00Z',
    accuracy: 0.92,
    parameters: {
      minSnapshots: 50,
      minYearsCovered: 3,
      maxAvgIntervalDays: 90,
      maxGapDays: 180,
      minTimemapCount: 100,
      weightSnapshots: 0.3,
      weightYearsCovered: 0.25,
      weightAvgInterval: 0.2,
      weightMaxGap: 0.15,
      weightUniqueVersions: 0.1
    },
    trainingHistory: [
      { date: '2025-05-15T10:30:00Z', accuracy: 0.92, samples: 1000 },
      { date: '2025-04-20T14:15:00Z', accuracy: 0.89, samples: 800 },
      { date: '2025-03-10T09:45:00Z', accuracy: 0.85, samples: 600 },
      { date: '2025-02-05T11:30:00Z', accuracy: 0.82, samples: 500 }
    ]
  };
  
  res.render('agent-settings', {
    title: agent.name,
    description: `Настройка AI-агента: ${agent.name}`,
    agent: agent
  });
});

// Обновление настроек AI-агента
router.post('/:agentId/update', (req, res) => {
  const agentId = req.params.agentId;
  
  // В реальном приложении здесь будет отправка обновленных настроек в API бэкенда
  const updatedParams = {
    minSnapshots: parseInt(req.body.minSnapshots) || 50,
    minYearsCovered: parseInt(req.body.minYearsCovered) || 3,
    maxAvgIntervalDays: parseInt(req.body.maxAvgIntervalDays) || 90,
    maxGapDays: parseInt(req.body.maxGapDays) || 180,
    minTimemapCount: parseInt(req.body.minTimemapCount) || 100,
    weightSnapshots: parseFloat(req.body.weightSnapshots) || 0.3,
    weightYearsCovered: parseFloat(req.body.weightYearsCovered) || 0.25,
    weightAvgInterval: parseFloat(req.body.weightAvgInterval) || 0.2,
    weightMaxGap: parseFloat(req.body.weightMaxGap) || 0.15,
    weightUniqueVersions: parseFloat(req.body.weightUniqueVersions) || 0.1
  };
  
  res.redirect(`/ai-agents/${agentId}`);
});

// Запуск обучения AI-агента
router.post('/:agentId/train', (req, res) => {
  const agentId = req.params.agentId;
  
  // В реальном приложении здесь будет отправка запроса на обучение в API бэкенда
  
  res.redirect(`/ai-agents/${agentId}`);
});

// Получение данных для графиков обучения
router.get('/:agentId/training-history', (req, res) => {
  const agentId = req.params.agentId;
  
  // В реальном приложении здесь будет получение истории обучения из API бэкенда
  const trainingHistory = {
    labels: ['05.02.2025', '10.03.2025', '20.04.2025', '15.05.2025'],
    datasets: [
      {
        label: 'Точность',
        data: [0.82, 0.85, 0.89, 0.92],
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Количество образцов',
        data: [500, 600, 800, 1000],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };
  
  res.json(trainingHistory);
});

module.exports = router;
