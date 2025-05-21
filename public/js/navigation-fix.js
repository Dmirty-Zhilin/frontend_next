// Проверка и исправление навигации
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
      
      // Выполняем переход
      window.location.href = path;
    });
  });
  
  // Логируем информацию о текущем пути для отладки
  console.log('Текущий путь:', window.location.pathname);
  console.log('Текущий хост:', window.location.hostname);
  console.log('Текущий origin:', window.location.origin);
});
