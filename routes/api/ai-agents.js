const express = require('express');
const router = express.Router();
const axios = require('axios');

// Получение API URL из переменных окружения
const API_URL = process.env.API_URL || 'http://backend:8005';

// Получение списка доступных AI агентов
router.get('/', async (req, res ) => {
  try {
    const response = await axios.get(`${API_URL}/api/ai-agents`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении списка AI агентов:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить список AI агентов',
      details: error.message
    });
  }
});

// Получение конкретного AI агента
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_URL}/api/ai-agents/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении AI агента:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить AI агента',
      details: error.message
    });
  }
});

// Создание нового AI агента
router.post('/', async (req, res) => {
  try {
    const agentData = req.body;
    const response = await axios.post(`${API_URL}/api/ai-agents`, agentData);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при создании AI агента:', error.message);
    res.status(500).json({ 
      error: 'Не удалось создать AI агента',
      details: error.message
    });
  }
});

// Обновление AI агента
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agentData = req.body;
    const response = await axios.put(`${API_URL}/api/ai-agents/${id}`, agentData);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при обновлении AI агента:', error.message);
    res.status(500).json({ 
      error: 'Не удалось обновить AI агента',
      details: error.message
    });
  }
});

// Удаление AI агента
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${API_URL}/api/ai-agents/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при удалении AI агента:', error.message);
    res.status(500).json({ 
      error: 'Не удалось удалить AI агента',
      details: error.message
    });
  }
});

// Получение моделей для AI агентов
router.get('/models/available', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/api/ai-agents/models/available`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении списка доступных моделей:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить список доступных моделей',
      details: error.message
    });
  }
});

module.exports = router;
