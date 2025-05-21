// Клиентские скрипты для интерактивных компонентов

// Функция для инициализации темной/светлой темы
function initThemeToggle() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`theme-${currentTheme}`);
  
  // Обработчик переключения темы
  document.addEventListener('click', function(e) {
    if (e.target.closest('.theme-toggle button')) {
      const newTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(`theme-${newTheme}`);
      localStorage.setItem('theme', newTheme);
      
      // Отправка запроса на сервер для сохранения темы в сессии
      fetch('/theme/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: newTheme })
      }).catch(err => console.error('Ошибка при сохранении темы:', err));
    }
  });
}

// Функция для инициализации интерактивных графиков
function initCharts() {
  // Настройка глобальных параметров Chart.js
  if (window.Chart) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = document.body.classList.contains('theme-dark') ? '#e5e7eb' : '#374151';
    
    // Адаптация цветов графиков для темной темы
    document.addEventListener('themeChanged', function() {
      Chart.defaults.color = document.body.classList.contains('theme-dark') ? '#e5e7eb' : '#374151';
      // Обновление всех графиков на странице
      Chart.instances.forEach(chart => chart.update());
    });
  }
}

// Функция для инициализации фильтров и сортировки таблиц
function initTableFilters() {
  const searchInputs = document.querySelectorAll('input[type="text"][id$="-search"]');
  searchInputs.forEach(input => {
    input.addEventListener('input', debounce(function() {
      const tableId = this.getAttribute('data-table') || this.id.replace('-search', '-table');
      const table = document.getElementById(tableId);
      if (!table) return;
      
      const searchTerm = this.value.toLowerCase();
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    }, 300));
  });
  
  // Функция для задержки выполнения (debounce)
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
}

// Функция для инициализации выпадающих меню
function initDropdowns() {
  document.addEventListener('click', function(e) {
    // Закрытие всех открытых дропдаунов при клике вне них
    if (!e.target.closest('.dropdown-toggle')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
      return;
    }
    
    // Открытие/закрытие дропдауна при клике на кнопку
    const dropdownToggle = e.target.closest('.dropdown-toggle');
    if (dropdownToggle) {
      e.preventDefault();
      const dropdownMenu = dropdownToggle.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.classList.toggle('show');
      }
    }
  });
}

// Функция для инициализации форм с расширенными настройками
function initAdvancedSettings() {
  const toggles = document.querySelectorAll('[data-toggle="collapse"]');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const target = document.querySelector(targetId);
      if (target) {
        target.classList.toggle('show');
        // Изменение текста или иконки переключателя
        const icon = this.querySelector('i, svg');
        if (icon) {
          icon.classList.toggle('rotate-180');
        }
      }
    });
  });
}

// Функция для инициализации всплывающих подсказок
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', function() {
      const text = this.getAttribute('data-tooltip');
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip';
      tooltipEl.textContent = text;
      document.body.appendChild(tooltipEl);
      
      const rect = this.getBoundingClientRect();
      tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 5}px`;
      tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2)}px`;
      tooltipEl.classList.add('show');
      
      this.addEventListener('mouseleave', function onMouseLeave() {
        tooltipEl.remove();
        this.removeEventListener('mouseleave', onMouseLeave);
      });
    });
  });
}

// Функция для инициализации проверки соединения с бэкендом
function checkBackendConnection() {
  const apiUrl = window.API_URL || 'http://backend:8005';
  
  fetch(`${apiUrl}/health`, { 
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (!response.ok) throw new Error(`Статус: ${response.status}`);
    return response.json();
  })
  .then(data => {
    console.log('Соединение с бэкендом установлено:', data);
    // Скрыть предупреждение, если оно отображается
    const connectionWarning = document.getElementById('backend-connection-warning');
    if (connectionWarning) connectionWarning.style.display = 'none';
  })
  .catch(error => {
    console.error('Ошибка соединения с бэкендом:', error);
    // Показать предупреждение
    const connectionWarning = document.getElementById('backend-connection-warning');
    if (connectionWarning) connectionWarning.style.display = 'block';
    else {
      // Создать предупреждение, если его нет
      const warning = document.createElement('div');
      warning.id = 'backend-connection-warning';
      warning.className = 'alert alert-warning fixed-top m-3';
      warning.innerHTML = `
        <strong>Предупреждение:</strong> Не удалось установить соединение с бэкендом. 
        Некоторые функции могут быть недоступны. 
        <button type="button" class="btn-close" aria-label="Close"></button>
      `;
      document.body.appendChild(warning);
      
      // Обработчик закрытия предупреждения
      warning.querySelector('.btn-close').addEventListener('click', function() {
        warning.style.display = 'none';
      });
    }
  });
}

// Инициализация всех компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initCharts();
  initTableFilters();
  initDropdowns();
  initAdvancedSettings();
  initTooltips();
  checkBackendConnection();
  
  // Дополнительная инициализация для конкретных страниц
  if (window.location.pathname.includes('/analysis')) {
    // Специфичная логика для страницы анализа
    const useAiCheckbox = document.getElementById('use_ai');
    const aiAgentSettings = document.getElementById('ai-agent-settings');
    
    if (useAiCheckbox && aiAgentSettings) {
      useAiCheckbox.addEventListener('change', function() {
        aiAgentSettings.style.display = this.checked ? 'block' : 'none';
      });
      // Инициализация при загрузке
      aiAgentSettings.style.display = useAiCheckbox.checked ? 'block' : 'none';
    }
  }
});
