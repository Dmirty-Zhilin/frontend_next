const express = require('express');
const router = express.Router();
const axios = require('axios');

// Получение API URL из переменных окружения
const API_URL = process.env.API_URL || 'http://backend:8005';

// Получение настроек анализа
router.get('/settings', async (req, res ) => {
  try {
    const response = await axios.get(`${API_URL}/api/analysis/settings`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении настроек анализа:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить настройки анализа',
      details: error.message
    });
  }
});

// Получение доступных AI моделей
router.get('/ai-models', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/analysis/ai-models`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении списка AI моделей:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить список AI моделей',
      details: error.message
    });
  }
});

// Получение статистики по анализам
router.get('/stats', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/analysis/stats`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении статистики анализов:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить статистику анализов',
      details: error.message
    });
  }
});

module.exports = router;
