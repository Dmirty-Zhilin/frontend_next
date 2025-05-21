// Сервис для работы с отчетами
const reportService = {
  // Форматирование данных отчета для отображения
  formatReportData: (data) => {
    if (!data) return null;
    
    // Форматирование дат
    if (data.first_snapshot) {
      data.first_snapshot_formatted = new Date(data.first_snapshot).toLocaleString();
    }
    
    if (data.last_snapshot) {
      data.last_snapshot_formatted = new Date(data.last_snapshot).toLocaleString();
    }
    
    // Форматирование числовых значений
    if (data.avg_interval_days) {
      data.avg_interval_days_formatted = data.avg_interval_days.toFixed(2);
    }
    
    if (data.analysis_time_sec) {
      data.analysis_time_sec_formatted = data.analysis_time_sec.toFixed(2);
    }
    
    return data;
  },
  
  // Подготовка данных для таблицы отчетов
  prepareTableData: (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => reportService.formatReportData(item));
  },
  
  // Подготовка данных для графиков
  prepareChartData: (data, chartType) => {
    if (!data) return null;
    
    switch (chartType) {
      case 'snapshots-by-year':
        if (data.snapshots_per_year) {
          const yearData = typeof data.snapshots_per_year === 'string' 
            ? JSON.parse(data.snapshots_per_year) 
            : data.snapshots_per_year;
          
          return {
            labels: Object.keys(yearData),
            datasets: [{
              label: 'Количество снимков',
              data: Object.values(yearData),
              backgroundColor: 'rgba(79, 70, 229, 0.6)',
              borderColor: 'rgba(79, 70, 229, 1)',
              borderWidth: 1
            }]
          };
        }
        break;
        
      case 'recommendations':
        return {
          labels: ['Рекомендовано', 'Не рекомендовано'],
          datasets: [{
            data: [
              data.filter(item => item.recommended).length,
              data.filter(item => !item.recommended).length
            ],
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
        
      case 'interval-distribution':
        // Группировка по интервалам
        const intervals = {
          '<1': 0,
          '1-7': 0,
          '7-30': 0,
          '30-90': 0,
          '>90': 0
        };
        
        data.forEach(item => {
          const avgInterval = parseFloat(item.avg_interval_days);
          if (avgInterval < 1) intervals['<1']++;
          else if (avgInterval < 7) intervals['1-7']++;
          else if (avgInterval < 30) intervals['7-30']++;
          else if (avgInterval < 90) intervals['30-90']++;
          else intervals['>90']++;
        });
        
        return {
          labels: ['<1 день', '1-7 дней', '7-30 дней', '30-90 дней', '>90 дней'],
          datasets: [{
            label: 'Количество доменов',
            data: Object.values(intervals),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }]
        };
    }
    
    return null;
  },
  
  // Фильтрация данных отчета
  filterReportData: (data, filters) => {
    if (!data || !Array.isArray(data) || !filters) return data;
    
    return data.filter(item => {
      let match = true;
      
      // Фильтр по домену
      if (filters.domain && item.domain) {
        match = match && item.domain.toLowerCase().includes(filters.domain.toLowerCase());
      }
      
      // Фильтр по наличию снимков
      if (filters.has_snapshot !== undefined && item.has_snapshot !== undefined) {
        match = match && item.has_snapshot === filters.has_snapshot;
      }
      
      // Фильтр по количеству снимков
      if (filters.min_snapshots && item.total_snapshots) {
        match = match && item.total_snapshots >= parseInt(filters.min_snapshots);
      }
      
      if (filters.max_snapshots && item.total_snapshots) {
        match = match && item.total_snapshots <= parseInt(filters.max_snapshots);
      }
      
      // Фильтр по годам покрытия
      if (filters.min_years && item.years_covered) {
        match = match && item.years_covered >= parseInt(filters.min_years);
      }
      
      // Фильтр по рекомендациям
      if (filters.recommended !== undefined && item.recommended !== undefined) {
        match = match && item.recommended === filters.recommended;
      }
      
      return match;
    });
  },
  
  // Сортировка данных отчета
  sortReportData: (data, sortField, sortOrder) => {
    if (!data || !Array.isArray(data) || !sortField) return data;
    
    return [...data].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Преобразование для правильной сортировки
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      // Для булевых значений
      if (typeof valueA === 'boolean') valueA = valueA ? 1 : 0;
      if (typeof valueB === 'boolean') valueB = valueB ? 1 : 0;
      
      // Сортировка
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
};

module.exports = reportService;
