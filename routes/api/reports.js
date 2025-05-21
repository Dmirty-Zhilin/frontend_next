const express = require('express');
const router = express.Router();
const axios = require('axios');

// Получение API URL из переменных окружения
const API_URL = process.env.API_URL || 'http://backend:8005';

// Получение списка отчетов
router.get('/', async (req, res ) => {
  try {
    const { page, limit } = req.query;
    const response = await axios.get(`${API_URL}/api/reports`, {
      params: { page, limit }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении списка отчетов:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить список отчетов',
      details: error.message
    });
  }
});

// Получение конкретного отчета
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_URL}/api/reports/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении отчета:', error.message);
    res.status(500).json({ 
      error: 'Не удалось получить отчет',
      details: error.message
    });
  }
});

// Экспорт отчета
router.get('/:id/export/:format', async (req, res) => {
  try {
    const { id, format } = req.params;
    const response = await axios.get(`${API_URL}/api/reports/${id}/export/${format}`, {
      responseType: 'arraybuffer'
    });
    
    const contentTypes = {
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      json: 'application/json'
    };
    
    res.setHeader('Content-Type', contentTypes[format] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=report-${id}.${format}`);
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Ошибка при экспорте отчета:', error.message);
    res.status(500).json({ 
      error: 'Не удалось экспортировать отчет',
      details: error.message
    });
  }
});

// Удаление отчета
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${API_URL}/api/reports/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при удалении отчета:', error.message);
    res.status(500).json({ 
      error: 'Не удалось удалить отчет',
      details: error.message
    });
  }
});

module.exports = router;
