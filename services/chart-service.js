// Сервис для работы с графиками
const chartService = {
  // Инициализация графика
  initChart: (ctx, type, data, options = {}) => {
    // В реальном приложении здесь будет использоваться Chart.js
    // Для демонстрации возвращаем объект с данными
    return {
      type,
      data,
      options,
      update: () => console.log('Chart updated')
    };
  },
  
  // Форматирование данных для графика по годам
  formatYearlyData: (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    return {
      labels,
      datasets: [{
        label: 'Количество снимков',
        data: values,
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1
      }]
    };
  },
  
  // Форматирование данных для круговой диаграммы
  formatPieData: (labels, values, colors) => {
    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.background || [],
        borderColor: colors.border || [],
        borderWidth: 1
      }]
    };
  },
  
  // Форматирование данных для линейного графика
  formatLineData: (labels, datasets) => {
    return {
      labels,
      datasets: datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || `rgba(79, 70, 229, 0.${2 + index})`,
        borderColor: dataset.borderColor || `rgba(79, 70, 229, ${1 - index * 0.2})`,
        borderWidth: 2,
        tension: 0.4,
        yAxisID: dataset.yAxisID
      }))
    };
  },
  
  // Получение опций для графика
  getChartOptions: (type, customOptions = {}) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      }
    };
    
    let typeOptions = {};
    
    switch (type) {
      case 'bar':
        typeOptions = {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
        break;
      case 'line':
        typeOptions = {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        };
        break;
      case 'pie':
      case 'doughnut':
        typeOptions = {
          plugins: {
            legend: {
              position: 'right',
            }
          }
        };
        break;
    }
    
    return { ...baseOptions, ...typeOptions, ...customOptions };
  }
};

module.exports = chartService;
