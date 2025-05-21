// Скрипт для статической версии
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация навигации
  initNavigation();
  
  // Инициализация переключателя темы
  initThemeToggle();
  
  // Логирование для отладки
  console.log('Статическая версия DropAnalyzer инициализирована');
});

// Инициализация навигации
function initNavigation() {
  // Получаем все ссылки с атрибутом data-page
  const navLinks = document.querySelectorAll('[data-page]');
  
  // Обрабатываем каждую ссылку
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Получаем ID страницы из атрибута data-page
      const pageId = this.getAttribute('data-page');
      
      // Переключаем страницу
      switchPage(pageId);
      
      // Логируем переход для отладки
      console.log('Переход на страницу:', pageId);
    });
  });
  
  // Проверяем хеш в URL при загрузке
  checkUrlHash();
  
  // Добавляем обработчик изменения хеша
  window.addEventListener('hashchange', checkUrlHash);
}

// Проверка хеша в URL
function checkUrlHash() {
  // Получаем хеш из URL без символа #
  let hash = window.location.hash.substring(1);
  
  // Если хеш пустой, устанавливаем его на главную страницу
  if (!hash) {
    hash = 'home';
  }
  
  // Переключаем страницу на основе хеша
  switchPage(hash);
  
  // Логируем хеш для отладки
  console.log('Текущий хеш:', hash);
}

// Переключение страницы
function switchPage(pageId) {
  // Скрываем все страницы
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем выбранную страницу
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
    
    // Обновляем заголовок страницы
    updatePageTitle(pageId);
    
    // Обновляем URL с хешем
    window.location.hash = '#' + pageId;
  } else {
    console.error('Страница не найдена:', pageId);
  }
  
  // Обновляем активный пункт меню
  updateActiveMenuItem(pageId);
}

// Обновление заголовка страницы
function updatePageTitle(pageId) {
  // Маппинг ID страниц на заголовки
  const pageTitles = {
    'home': 'Главная | Анализатор дропов',
    'dashboard': 'Панель управления | Анализатор дропов',
    'analysis': 'Анализ доменов | Анализатор дропов',
    'reports': 'Отчеты | Анализатор дропов',
    'ai-agents': 'AI-агенты | Анализатор дропов'
  };
  
  // Устанавливаем заголовок страницы
  if (pageTitles[pageId]) {
    document.title = pageTitles[pageId];
  }
}

// Обновление активного пункта меню
function updateActiveMenuItem(pageId) {
  // Удаляем класс active у всех пунктов меню
  const menuItems = document.querySelectorAll('.main-nav a');
  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Добавляем класс active к выбранному пункту меню
  const activeMenuItem = document.querySelector(`.main-nav a[data-page="${pageId}"]`);
  if (activeMenuItem) {
    activeMenuItem.classList.add('active');
  }
}

// Инициализация переключателя темы
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
  
  // Проверяем сохраненную тему
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeIcon) themeIcon.textContent = '☀️';
  }
  
  // Обработчик клика по переключателю темы
  themeToggle.addEventListener('click', function() {
    // Переключаем класс темы
    document.body.classList.toggle('dark-theme');
    
    // Обновляем иконку
    if (themeIcon) {
      const isDarkTheme = document.body.classList.contains('dark-theme');
      themeIcon.textContent = isDarkTheme ? '☀️' : '🌙';
    }
    
    // Сохраняем выбор в localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    
    // Логируем изменение для отладки
    console.log('Тема изменена на:', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
}
