// Простой скрипт для обработки активного состояния ссылок
document.addEventListener('DOMContentLoaded', function() {
  // Получаем текущий путь
  const currentPath = window.location.pathname;
  
  // Получаем все ссылки в навигации
  const navLinks = document.querySelectorAll('.main-nav a');
  
  // Устанавливаем активный класс для соответствующей ссылки
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Проверяем, соответствует ли путь ссылки текущему пути
    if (linkPath === currentPath || 
        (linkPath === '/' && currentPath === '') || 
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Логируем информацию о текущем пути для отладки
  console.log('Текущий путь:', window.location.pathname);
});

// Функция для переключения темы
function toggleTheme() {
  const htmlRoot = document.documentElement;
  const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Устанавливаем новую тему
  htmlRoot.setAttribute('data-theme', newTheme);
  
  // Обновляем иконку переключателя темы
  const themeIcon = document.querySelector('.theme-toggle-icon');
  if (themeIcon) {
    themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
  }
  
  // Сохраняем выбор пользователя в куки
  document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  
  // Обновляем все элементы с классом theme-dependent
  const themeElements = document.querySelectorAll('.theme-dependent');
  themeElements.forEach(el => {
    el.setAttribute('data-theme', newTheme);
  });
}

// Добавляем обработчик события для кнопки переключения темы
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});
