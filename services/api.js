const axios = require('axios');

// Базовый URL API бэкенда
const API_URL = process.env.API_URL || 'http://localhost:8005';

// Настройка Axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Обработка ошибок
const handleApiError = (error) => {
  if (error.response) {
    // Ошибка от сервера с ответом
    console.error('API Error Response:', error.response.status, error.response.data);
    return {
      error: true,
      status: error.response.status,
      message: error.response.data.message || 'Ошибка сервера',
      data: error.response.data
    };
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    console.error('API No Response:', error.request);
    return {
      error: true,
      status: 0,
      message: 'Нет ответа от сервера',
      data: null
    };
  } else {
    // Ошибка при настройке запроса
    console.error('API Request Error:', error.message);
    return {
      error: true,
      status: 0,
      message: error.message,
      data: null
    };
  }
};

// API для работы с доменами
const domainsApi = {
  // Получение списка доменов
  getList: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/domains', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Загрузка файла с доменами
  uploadFile: async (formData) => {
    try {
      const response = await apiClient.post('/api/domains/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API для работы с анализом
const analysisApi = {
  // Запуск нового анализа
  startAnalysis: async (params) => {
    try {
      const response = await apiClient.post('/api/analysis/start', params);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение статуса анализа
  getStatus: async (taskId) => {
    try {
      const response = await apiClient.get(`/api/analysis/status/${taskId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Отмена анализа
  cancelAnalysis: async (taskId) => {
    try {
      const response = await apiClient.post(`/api/analysis/cancel/${taskId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API для работы с отчетами
const reportsApi = {
  // Получение списка отчетов
  getList: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/reports', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение данных отчета
  getReport: async (reportId) => {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение данных для таблицы отчета
  getReportData: async (reportId, params = {}) => {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}/data`, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение данных для графиков отчета
  getChartData: async (reportId, chartType) => {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}/chart-data`, { 
        params: { type: chartType } 
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Экспорт отчета
  exportReport: async (reportId, format) => {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}/export/${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// API для работы с AI-агентами
const aiAgentsApi = {
  // Получение списка AI-агентов
  getList: async () => {
    try {
      const response = await apiClient.get('/api/ai-agents');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение данных AI-агента
  getAgent: async (agentId) => {
    try {
      const response = await apiClient.get(`/api/ai-agents/${agentId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Обновление настроек AI-агента
  updateAgent: async (agentId, params) => {
    try {
      const response = await apiClient.put(`/api/ai-agents/${agentId}`, params);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Запуск обучения AI-агента
  trainAgent: async (agentId, params = {}) => {
    try {
      const response = await apiClient.post(`/api/ai-agents/${agentId}/train`, params);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Получение истории обучения AI-агента
  getTrainingHistory: async (agentId) => {
    try {
      const response = await apiClient.get(`/api/ai-agents/${agentId}/training-history`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

module.exports = {
  domainsApi,
  analysisApi,
  reportsApi,
  aiAgentsApi
};
