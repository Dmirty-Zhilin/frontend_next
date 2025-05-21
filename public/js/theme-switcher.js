// Обновленный скрипт для переключения темы
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlRoot = document.documentElement;
    const bodyElement = document.body;
    const themeIcon = document.querySelector('.theme-toggle-icon');
    
    // Функция переключения темы
    function toggleTheme() {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Применяем тему к HTML и BODY элементам
        htmlRoot.setAttribute('data-theme', newTheme);
        bodyElement.setAttribute('data-theme', newTheme);
        
        // Обновляем иконку
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
        
        // Сохраняем выбор пользователя в куки
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
        
        // Обновляем все элементы с классом theme-dependent
        const themeElements = document.querySelectorAll('.theme-dependent');
        themeElements.forEach(element => {
            element.setAttribute('data-theme', newTheme);
        });
    }
    
    // Добавляем обработчик события для кнопки переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Инициализация: применяем текущую тему к body
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
    bodyElement.setAttribute('data-theme', currentTheme);
    
    // Инициализация: применяем текущую тему ко всем элементам с классом theme-dependent
    const themeElements = document.querySelectorAll('.theme-dependent');
    themeElements.forEach(element => {
        element.setAttribute('data-theme', currentTheme);
    });
});
