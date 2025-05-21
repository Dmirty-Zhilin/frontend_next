// Клиентские скрипты для интерактивных компонентов

// Функция для инициализации темной/светлой темы
function initThemeToggle() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.body.setAttribute('data-theme', currentTheme);
  
  // Обработчик переключения темы
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Обновление иконки переключателя
      const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
      if (themeIcon) {
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
      }
      
      // Отправка события изменения темы
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
      
      // Отправка запроса на сервер для сохранения темы в сессии
      fetch('/theme/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: newTheme })
      }).catch(err => console.error('Ошибка при сохранении темы:', err));
    });
  }
}

// Функция для инициализации интерактивных графиков
function initCharts() {
  // Настройка глобальных параметров Chart.js
  if (window.Chart) {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151';
    
    // Адаптация цветов графиков для темной темы
    document.addEventListener('themeChanged', function() {
      Chart.defaults.color = document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151';
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
  // Используем относительный URL или берем из переменной окружения
  const apiUrl = window.API_URL || '/api/v1';
  
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
      warning.className = 'alert alert-warning fixed-bottom m-3';
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

// Функция для инициализации хеш-навигации
function initHashNavigation() {
  // Обработка начального хеша при загрузке страницы
  if (window.location.hash) {
    const hash = window.location.hash.substring(1); // Убираем символ #
    loadContent(hash);
  }

  // Обработка изменения хеша
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    loadContent(hash);
  });

  // Обработка клика по ссылкам навигации
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const hash = link.getAttribute('href').substring(1);
      window.location.hash = hash;
      
      // Активация пункта меню
      document.querySelectorAll('.main-nav a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Находим соответствующий пункт меню и активируем его
      const menuItem = document.querySelector(`.main-nav a[href="#${hash.split('/')[0]}"]`);
      if (menuItem) {
        menuItem.classList.add('active');
      }
    }
  });
}

// Функция для загрузки контента по хешу
function loadContent(hash) {
  if (!hash) return;
  
  // Разбиваем хеш на части (например, "reports/report-001" -> ["reports", "report-001"])
  const parts = hash.split('/');
  const section = parts[0]; // Основной раздел (например, "reports")
  const subSection = parts.length > 1 ? parts.slice(1).join('/') : null; // Подраздел (например, "report-001")
  
  // Активация пункта меню
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  const menuItem = document.querySelector(`.main-nav a[href="#${section}"]`);
  if (menuItem) {
    menuItem.classList.add('active');
  }
  
  // Загрузка контента
  const contentContainer = document.querySelector('.main-content .container');
  if (!contentContainer) return;
  
  // Формируем URL для загрузки контента
  let contentUrl;
  if (subSection) {
    // Для вложенных страниц используем путь вида "/reports/report-001"
    contentUrl = `/${section}/${subSection}`;
  } else {
    // Для основных разделов используем путь вида "/dashboard"
    contentUrl = `/${section}`;
  }
  
  // Загружаем контент через AJAX
  fetch(contentUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Статус: ${response.status}`);
      return response.text();
    })
    .then(html => {
      contentContainer.innerHTML = html;
      // Инициализация скриптов для нового контента
      initCharts();
      initTableFilters();
      initDropdowns();
      initAdvancedSettings();
      initTooltips();
    })
    .catch(error => {
      console.error('Ошибка загрузки контента:', error);
      contentContainer.innerHTML = `
        <div class="error-container">
          <h1>Ошибка загрузки</h1>
          <p>Не удалось загрузить запрашиваемый контент. Пожалуйста, попробуйте позже.</p>
          <p class="text-muted">Детали ошибки: ${error.message}</p>
        </div>
      `;
    });
}

// Инициализация всех компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация темы
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.body.setAttribute('data-theme', savedTheme);
  
  // Инициализация компонентов
  initThemeToggle();
  initCharts();
  initTableFilters();
  initDropdowns();
  initAdvancedSettings();
  initTooltips();
  initHashNavigation();
  checkBackendConnection();
  
  // Дополнительная инициализация для конкретных страниц
  if (window.location.pathname.includes('/analysis') || window.location.hash.startsWith('#analysis')) {
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
