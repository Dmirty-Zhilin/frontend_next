/**
 * charts.js - Компонент для работы с графиками
 * Заменяет функциональность React-компонентов для графиков
 */

// Инициализация графиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация графиков на странице дашборда
  initDashboardCharts();
  
  // Инициализация графиков на странице отчетов
  initReportCharts();
  
  // Инициализация графиков на странице анализа
  initAnalysisCharts();
});

/**
 * Инициализация графиков на странице дашборда
 */
function initDashboardCharts() {
  const dashboardChartsContainer = document.getElementById('dashboard-charts');
  if (!dashboardChartsContainer) return;
  
  // График активности по дням
  const activityCtx = document.getElementById('activity-chart');
  if (activityCtx) {
    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [{
          label: 'Активность',
          data: [12, 19, 3, 5, 2, 3, 7],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Активность по дням'
          }
        }
      }
    });
  }
  
  // График распределения доменов
  const domainsCtx = document.getElementById('domains-chart');
  if (domainsCtx) {
    new Chart(domainsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Активные', 'Истекшие', 'На продаже'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: [
            '#2ecc71',
            '#e74c3c',
            '#f39c12'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Распределение доменов'
          }
        }
      }
    });
  }
}

/**
 * Инициализация графиков на странице отчетов
 */
function initReportCharts() {
  const reportChartsContainer = document.getElementById('report-charts');
  if (!reportChartsContainer) return;
  
  // Получение данных из атрибутов data-*
  const chartContainers = document.querySelectorAll('[data-chart-type]');
  
  chartContainers.forEach(container => {
    const chartType = container.getAttribute('data-chart-type');
    const chartData = JSON.parse(container.getAttribute('data-chart-data') || '{}');
    const chartOptions = JSON.parse(container.getAttribute('data-chart-options') || '{}');
    
    const canvas = container.querySelector('canvas');
    if (canvas) {
      new Chart(canvas, {
        type: chartType,
        data: chartData,
        options: chartOptions
      });
    }
  });
}

/**
 * Инициализация графиков на странице анализа
 */
function initAnalysisCharts() {
  const analysisChartsContainer = document.getElementById('analysis-charts');
  if (!analysisChartsContainer) return;
  
  // Аналогично initReportCharts, но с другими параметрами
}

/**
 * Обновление графика с новыми данными
 * @param {string} chartId - ID элемента canvas
 * @param {Object} newData - Новые данные для графика
 */
function updateChart(chartId, newData) {
  const chartElement = document.getElementById(chartId);
  if (!chartElement) return;
  
  const chartInstance = Chart.getChart(chartElement);
  if (chartInstance) {
    chartInstance.data = newData;
    chartInstance.update();
  }
}

/**
 * Создание нового графика
 * @param {string} containerId - ID контейнера для графика
 * @param {string} chartType - Тип графика (line, bar, pie и т.д.)
 * @param {Object} chartData - Данные для графика
 * @param {Object} chartOptions - Опции для графика
 */
function createChart(containerId, chartType, chartData, chartOptions) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Создаем canvas элемент
  const canvas = document.createElement('canvas');
  const canvasId = `chart-${Date.now()}`;
  canvas.id = canvasId;
  container.appendChild(canvas);
  
  // Создаем график
  new Chart(canvas, {
    type: chartType,
    data: chartData,
    options: chartOptions
  });
  
  return canvasId;
}
