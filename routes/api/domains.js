const express = require('express');
const router = express.Router();
const axios = require('axios');

// Получение API URL из переменных окружения
const API_URL = process.env.API_URL || 'http://backend:8005';

// Получение списка доменов
router.get('/', async (req, res ) => {
  try {
    const response = await axios.get(`${API_URL}/api/domains`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении списка доменов:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить список доменов',
      details: error.message
    });
  }
});

// Отправка доменов на анализ
router.post('/analyze', async (req, res) => {
  try {
    const { domains, options } = req.body;
    const response = await axios.post(`${API_URL}/api/domains/analyze`, {
      domains,
      options
    });
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при отправке доменов на анализ:', error.message);
    res.status(500).json({ 
      error: 'Не удалось отправить домены на анализ',
      details: error.message
    });
  }
});

// Получение статуса анализа
router.get('/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const response = await axios.get(`${API_URL}/api/domains/status/${taskId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении статуса анализа:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить статус анализа',
      details: error.message
    });
  }
});

// Получение результатов анализа
router.get('/results/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const response = await axios.get(`${API_URL}/api/domains/results/${taskId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении результатов анализа:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить результаты анализа',
      details: error.message
    });
  }
});

module.exports = router;
