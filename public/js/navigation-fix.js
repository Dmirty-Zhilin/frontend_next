// Улучшенная обработка маршрутов для Coolify
document.addEventListener('DOMContentLoaded', function() {
  // Получаем все ссылки на странице
  const links = document.querySelectorAll('a');
  
  // Обрабатываем каждую ссылку
  links.forEach(link => {
    // Пропускаем внешние ссылки и якоря
    if (link.href.startsWith('http') && !link.href.includes(window.location.hostname) || 
        link.href.startsWith('#') || 
        link.href.startsWith('javascript:')) {
      return;
    }
    
    // Добавляем обработчик клика для всех внутренних ссылок
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Получаем путь из href
      let path = this.getAttribute('href');
      
      // Проверяем, начинается ли путь с /
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      // Логируем переход для отладки
      console.log('Переход по ссылке:', path);
      
      // Получаем базовый URL из переменной окружения или используем корневой путь
      const baseUrl = window.BASE_URL || '/';
      
      // Формируем полный URL с учетом базового пути
      let fullPath = path;
      if (baseUrl !== '/' && !path.startsWith(baseUrl)) {
        fullPath = baseUrl.endsWith('/') ? baseUrl + path.substring(1) : baseUrl + path;
      }
      
      console.log('Полный путь:', fullPath);
      
      // Выполняем переход
      window.location.href = fullPath;
    });
  });
  
  // Логируем информацию о текущем пути для отладки
  console.log('Текущий путь:', window.location.pathname);
  console.log('Текущий хост:', window.location.hostname);
  console.log('Текущий origin:', window.location.origin);
  console.log('Базовый URL:', window.BASE_URL || '/');
});
