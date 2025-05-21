// Улучшенная реализация навигации для SPA
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация навигации
  initNavigation();
  
  // Обработка изменения URL при использовании кнопок браузера назад/вперед
  window.addEventListener('popstate', function(event) {
    // Обновляем активный пункт меню на основе текущего пути
    updateActiveMenuItem(window.location.pathname);
  });
});

// Инициализация навигации
function initNavigation() {
  // Получаем все ссылки на странице
  const links = document.querySelectorAll('a');
  
  // Обрабатываем каждую ссылку
  links.forEach(link => {
    // Пропускаем внешние ссылки, якоря и ссылки с уже установленным обработчиком
    if (link.href.startsWith('http') && !link.href.includes(window.location.hostname) || 
        link.href.startsWith('#') || 
        link.href.startsWith('javascript:') ||
        link.getAttribute('href').startsWith('#') ||
        link.hasAttribute('data-navigation-initialized')) {
      return;
    }
    
    // Помечаем ссылку как инициализированную, чтобы избежать дублирования обработчиков
    link.setAttribute('data-navigation-initialized', 'true');
    
    // Добавляем обработчик клика для всех внутренних ссылок
    link.addEventListener('click', function(e) {
      // Получаем путь из href
      let path = this.getAttribute('href');
      
      // Проверяем, является ли это внутренней ссылкой
      if (path.startsWith('/') || path === '') {
        e.preventDefault();
        
        // Используем History API вместо хешей для навигации
        history.pushState({}, '', path);
        
        // Обновляем активный пункт меню
        updateActiveMenuItem(path);
        
        // Логируем переход для отладки
        console.log('Переход по ссылке:', path);
      }
    });
  });
  
  // Обновляем активный пункт меню при загрузке страницы
  updateActiveMenuItem(window.location.pathname);
}

// Обновление активного пункта меню
function updateActiveMenuItem(path) {
  // Получаем все пункты меню
  const menuItems = document.querySelectorAll('.main-nav a');
  
  // Маппинг путей на заголовки страниц
  const pathToTitle = {
    '/': 'Главная',
    '/dashboard': 'Дашборд',
    '/analysis': 'Анализ доменов',
    '/reports': 'Отчеты',
    '/ai-agents': 'AI-агенты'
  };
  
  // Удаляем класс active у всех пунктов меню
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Находим соответствующий пункт меню и добавляем класс active
  menuItems.forEach(item => {
    if (item.getAttribute('href') === path) {
      item.classList.add('active');
    }
  });
  
  // Проверка соединения с бэкендом
  checkBackendConnection();
}

// Проверка соединения с бэкендом
function checkBackendConnection() {
  const API_URL = process.env.API_URL || 'http://localhost:8005';
  
  // Выполняем запрос к API для проверки соединения
  fetch(API_URL + '/api/health', { 
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    // Устанавливаем короткий таймаут для быстрой проверки
    signal: AbortSignal.timeout(5000)
  })
  .then(response => {
    if (response.ok) {
      // Если соединение установлено, скрываем предупреждение
      hideBackendWarning();
    } else {
      // Если сервер ответил с ошибкой, показываем предупреждение
      showBackendWarning();
    }
  })
  .catch(error => {
    // Если произошла ошибка соединения, показываем предупреждение
    showBackendWarning();
    console.error('Ошибка соединения с бэкендом:', error);
  });
}

// Показать предупреждение о проблеме с бэкендом
function showBackendWarning() {
  // Проверяем, существует ли уже предупреждение
  let warningElement = document.getElementById('backend-warning');
  
  // Если предупреждения нет, создаем его
  if (!warningElement) {
    warningElement = document.createElement('div');
    warningElement.id = 'backend-warning';
    warningElement.className = 'warning-message';
    warningElement.innerHTML = 'Предупреждение: Не удалось установить соединение с бэкендом. Некоторые функции могут быть недоступны.';
    
    // Добавляем стили для предупреждения
    warningElement.style.backgroundColor = '#fff3cd';
    warningElement.style.color = '#856404';
    warningElement.style.padding = '10px 15px';
    warningElement.style.borderRadius = '4px';
    warningElement.style.margin = '10px 0';
    warningElement.style.textAlign = 'center';
    
    // Добавляем предупреждение в начало основного контента
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.insertBefore(warningElement, mainContent.firstChild);
    }
  }
}

// Скрыть предупреждение о проблеме с бэкендом
function hideBackendWarning() {
  const warningElement = document.getElementById('backend-warning');
  if (warningElement) {
    warningElement.remove();
  }
}
