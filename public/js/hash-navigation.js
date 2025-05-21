// Реализация хеш-навигации для SPA
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация хеш-навигации
  initHashNavigation();
  
  // Обработка изменения хеша
  window.addEventListener('hashchange', handleHashChange);
  
  // Первоначальная загрузка контента на основе текущего хеша
  handleHashChange();
});

// Инициализация хеш-навигации
function initHashNavigation() {
  // Получаем все ссылки на странице
  const links = document.querySelectorAll('a');
  
  // Обрабатываем каждую ссылку
  links.forEach(link => {
    // Пропускаем внешние ссылки, якоря и ссылки с уже установленным хешем
    if (link.href.startsWith('http') && !link.href.includes(window.location.hostname) || 
        link.href.startsWith('#') || 
        link.href.startsWith('javascript:') ||
        link.getAttribute('href').startsWith('#')) {
      return;
    }
    
    // Добавляем обработчик клика для всех внутренних ссылок
    link.addEventListener('click', function(e) {
      // Проверяем, не является ли ссылка уже активной
      if (this.classList.contains('active')) {
        // Если ссылка уже активна, просто предотвращаем действие по умолчанию
        // и не меняем хеш, чтобы избежать добавления #страница
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      
      // Получаем путь из href
      let path = this.getAttribute('href');
      
      // Проверяем, начинается ли путь с /
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      
      // Если путь пустой, это главная страница
      if (path === '') {
        path = 'home';
      }
      
      // Логируем переход для отладки
      console.log('Переход по хеш-ссылке:', path);
      
      // Устанавливаем хеш для навигации
      window.location.hash = path; // Убираем дополнительный символ # перед path
    });
  });
  
  // Если хеш не установлен, устанавливаем его на главную страницу
  if (!window.location.hash) {
    window.location.hash = 'home'; // Убираем дополнительный символ # перед home
  }
}

// Обработка изменения хеша
function handleHashChange() {
  // Получаем текущий хеш без символа #
  let hash = window.location.hash.substring(1);
  
  // Если хеш пустой, устанавливаем его на главную страницу
  if (!hash) {
    hash = 'home';
    window.location.hash = hash; // Убираем дополнительный символ # перед hash
    return;
  }
  
  // Логируем текущий хеш для отладки
  console.log('Текущий хеш:', hash);
  
  // Загружаем контент на основе хеша
  loadContent(hash);
  
  // Обновляем активный пункт меню
  updateActiveMenuItem(hash);
}

// Загрузка контента на основе хеша
function loadContent(hash) {
  // Определяем URL для загрузки контента
  let url = '/api/content/' + hash;
  
  // Для демонстрации используем маппинг хешей на реальные пути
  const hashToPath = {
    'home': '/',
    'dashboard': '/dashboard',
    'analysis': '/analysis',
    'reports': '/reports',
    'ai-agents': '/ai-agents'
  };
  
  // Если есть маппинг для хеша, используем его
  if (hashToPath[hash]) {
    url = hashToPath[hash];
  }
  
  // Логируем URL для отладки
  console.log('Загрузка контента с URL:', url);
  
  // Для демонстрации просто перенаправляем на соответствующую страницу
  // В реальном SPA здесь был бы AJAX-запрос для загрузки контента
  // без перезагрузки страницы
  if (url !== window.location.pathname) {
    // Сохраняем текущий хеш
    const currentHash = window.location.hash;
    
    // Отключаем обработчик изменения хеша, чтобы избежать рекурсии
    window.removeEventListener('hashchange', handleHashChange);
    
    // Перенаправляем на соответствующую страницу
    window.location.href = url + currentHash;
  }
}

// Обновление активного пункта меню
function updateActiveMenuItem(hash) {
  // Получаем все пункты меню
  const menuItems = document.querySelectorAll('.main-nav a');
  
  // Маппинг хешей на заголовки страниц
  const hashToTitle = {
    'home': 'Главная',
    'dashboard': 'Дашборд',
    'analysis': 'Анализ',
    'reports': 'Отчеты',
    'ai-agents': 'AI-агенты'
  };
  
  // Удаляем класс active у всех пунктов меню
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Если есть заголовок для хеша, находим соответствующий пункт меню и добавляем класс active
  if (hashToTitle[hash]) {
    menuItems.forEach(item => {
      if (item.textContent === hashToTitle[hash]) {
        item.classList.add('active');
      }
    });
  }
}
