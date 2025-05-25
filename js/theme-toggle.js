document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeStyle = document.getElementById('theme-style');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Aplicar tema guardado
    function applyTheme(theme) {
        const root = document.documentElement;

        // Aplicar variables directamente en vez de cambiar el CSS externo
        root.style.setProperty('--bg-color', theme === 'dark' ? '#121212' : '#f5f7fa');
        root.style.setProperty('--text-color', theme === 'dark' ? '#e0e0e0' : '#333');
        root.style.setProperty('--primary-color', theme === 'dark' ? '#6c8eff' : '#4a6cf7');
        root.style.setProperty('--card-bg', theme === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)');
        root.style.setProperty('--border-color', theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)');

        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Cambiar tema
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'dark'
            : 'light';

        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // Inicializar
    applyTheme(currentTheme);
});

