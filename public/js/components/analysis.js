/**
 * analysis.js - Компонент для функционала анализа доменов
 * Заменяет функциональность React-компонентов для анализа
 */

// Инициализация функционала анализа при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация формы анализа
  initAnalysisForm();
  
  // Инициализация таблицы результатов
  initResultsTable();
  
  // Инициализация фильтров
  initFilters();
  
  // Обработчик переключения темы
  initThemeToggle();
});

/**
 * Инициализация формы анализа
 */
function initAnalysisForm() {
  const analysisForm = document.getElementById('analysis-form');
  if (!analysisForm) return;
  
  analysisForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получение данных формы
    const formData = new FormData(analysisForm);
    const domain = formData.get('domain');
    
    // Валидация
    if (!domain) {
      showNotification('Пожалуйста, введите домен для анализа', 'error');
      return;
    }
    
    // Показ индикатора загрузки
    showLoading(true);
    
    // Отправка запроса на сервер
    fetch('/api/analysis/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })
    .then(response => response.json())
    .then(data => {
      // Скрытие индикатора загрузки
      showLoading(false);
      
      if (data.error) {
        showNotification(data.error, 'error');
        return;
      }
      
      // Обновление UI с результатами
      updateResults(data);
      
      // Показ уведомления об успехе
      showNotification('Анализ успешно завершен', 'success');
    })
    .catch(error => {
      // Скрытие индикатора загрузки
      showLoading(false);
      
      // Показ уведомления об ошибке
      showNotification('Произошла ошибка при анализе: ' + error.message, 'error');
    });
  });
}

/**
 * Инициализация таблицы результатов
 */
function initResultsTable() {
  const resultsTable = document.getElementById('results-table');
  if (!resultsTable) return;
  
  // Инициализация сортировки
  const headers = resultsTable.querySelectorAll('th[data-sort]');
  headers.forEach(header => {
    header.addEventListener('click', function() {
      const column = this.getAttribute('data-sort');
      const direction = this.classList.contains('sort-asc') ? 'desc' : 'asc';
      
      // Сброс классов сортировки для всех заголовков
      headers.forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
      });
      
      // Установка класса сортировки для текущего заголовка
      this.classList.add(`sort-${direction}`);
      
      // Сортировка таблицы
      sortTable(resultsTable, column, direction);
    });
  });
}

/**
 * Сортировка таблицы
 * @param {HTMLElement} table - Элемент таблицы
 * @param {string} column - Название колонки для сортировки
 * @param {string} direction - Направление сортировки (asc/desc)
 */
function sortTable(table, column, direction) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  // Определение индекса колонки
  const headerRow = table.querySelector('thead tr');
  const headers = Array.from(headerRow.querySelectorAll('th'));
  const columnIndex = headers.findIndex(h => h.getAttribute('data-sort') === column);
  
  if (columnIndex === -1) return;
  
  // Сортировка строк
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent.trim();
    const bValue = b.cells[columnIndex].textContent.trim();
    
    // Проверка на числовые значения
    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    }
    
    // Строковое сравнение
    return direction === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });
  
  // Обновление DOM
  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const filterForm = document.getElementById('filter-form');
  if (!filterForm) return;
  
  filterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получение данных формы
    const formData = new FormData(filterForm);
    const filters = Object.fromEntries(formData.entries());
    
    // Применение фильтров
    applyFilters(filters);
  });
  
  // Сброс фильтров
  const resetButton = document.getElementById('reset-filters');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      filterForm.reset();
      applyFilters({});
    });
  }
}

/**
 * Применение фильтров к таблице результатов
 * @param {Object} filters - Объект с фильтрами
 */
function applyFilters(filters) {
  const resultsTable = document.getElementById('results-table');
  if (!resultsTable) return;
  
  const rows = resultsTable.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    let visible = true;
    
    // Проверка каждого фильтра
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return; // Пропускаем пустые фильтры
      
      const cell = row.querySelector(`td[data-filter="${key}"]`);
      if (!cell) return;
      
      const cellValue = cell.textContent.trim().toLowerCase();
      const filterValue = value.toLowerCase();
      
      // Если значение ячейки не содержит значение фильтра, скрываем строку
      if (!cellValue.includes(filterValue)) {
        visible = false;
      }
    });
    
    // Показываем или скрываем строку
    row.style.display = visible ? '' : 'none';
  });
}

/**
 * Обновление UI с результатами анализа
 * @param {Object} data - Данные результатов анализа
 */
function updateResults(data) {
  // Обновление таблицы результатов
  const resultsTable = document.getElementById('results-table');
  if (resultsTable) {
    const tbody = resultsTable.querySelector('tbody');
    if (tbody) {
      // Очистка таблицы
      tbody.innerHTML = '';
      
      // Заполнение таблицы новыми данными
      data.results.forEach(item => {
        const row = document.createElement('tr');
        
        // Создание ячеек с данными
        Object.entries(item).forEach(([key, value]) => {
          const cell = document.createElement('td');
          cell.setAttribute('data-filter', key);
          cell.textContent = value;
          row.appendChild(cell);
        });
        
        tbody.appendChild(row);
      });
    }
  }
  
  // Обновление сводной информации
  if (data.summary) {
    Object.entries(data.summary).forEach(([key, value]) => {
      const element = document.getElementById(`summary-${key}`);
      if (element) {
        element.textContent = value;
      }
    });
  }
  
  // Обновление графиков, если они есть
  if (data.chartData && window.updateChart) {
    Object.entries(data.chartData).forEach(([chartId, chartData]) => {
      window.updateChart(chartId, chartData);
    });
  }
}

/**
 * Показ/скрытие индикатора загрузки
 * @param {boolean} show - Показать или скрыть индикатор
 */
function showLoading(show) {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = show ? 'flex' : 'none';
  }
}

/**
 * Показ уведомления
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success/error/info)
 */
function showNotification(message, type = 'info') {
  const notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    // Создаем контейнер, если его нет
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Добавляем кнопку закрытия
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', function() {
    notification.remove();
  });
  
  notification.appendChild(closeButton);
  
  // Добавляем уведомление в контейнер
  document.getElementById('notification-container').appendChild(notification);
  
  // Автоматическое скрытие через 5 секунд
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Инициализация переключателя темы
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Обновление атрибута темы
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Обновление иконки
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    if (themeIcon) {
      themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
    
    // Сохранение выбора в cookie
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 год
  });
}
