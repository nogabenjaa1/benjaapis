document.addEventListener('DOMContentLoaded', async () => {
    // Variables globales
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const themeToggle = document.querySelector('.theme-toggle');
    const apiList = document.getElementById('api-list');
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    const closePreview = document.getElementById('close-preview');
    let allApis = [];

    // 🌐 Cargar APIs desde JSON
    async function loadApis() {
        try {
            const response = await fetch('apis/data.json');
            allApis = await response.json();
            console.log("APIs cargadas:", allApis);
            renderApis();
        } catch (error) {
            console.error("Error cargando las APIs:", error);
        }
    }

    // 🎨 Renderizar APIs
    function renderApis(filteredApis = allApis) {
        apiList.innerHTML = '';

        if (filteredApis.length === 0) {
            apiList.innerHTML = '<div class="no-results">No se encontraron coincidencias</div>';
            return;
        }

        filteredApis.forEach(api => {
            const apiItem = document.createElement('div');
            apiItem.className = 'api-item';
            apiItem.innerHTML = `
                <div class="col-name">
                    <i class="${api.icon}"></i>
                    <span>${api.name}</span>
                </div>
                <div class="col-desc">${api.desc}</div>
                <div class="col-actions">
                    <button class="btn view-code" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <a href="apis/${api.file}" download class="btn download" title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            `;

            // 📄 Agregar listener al botón de preview
            const previewBtn = apiItem.querySelector('.view-code');
            previewBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`apis/${api.file}`);
                    if (!response.ok) throw new Error("Archivo no encontrado");
                    const content = await response.text();
                    previewContent.textContent = content;
                } catch (err) {
                    previewContent.textContent = 'Error al cargar la vista previa.';
                }

                previewModal.classList.remove('hidden');
            });

            apiList.appendChild(apiItem);
        });
    }

    // 🔍 Búsqueda
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!searchTerm) {
            searchResults.style.display = 'none';
            renderApis();
            return;
        }

        const matches = allApis.filter(api =>
            api.name.toLowerCase().includes(searchTerm)
        );

        if (matches.length > 0) {
            const fragment = document.createDocumentFragment();
            matches.forEach(api => {
                const resultElement = document.createElement('div');
                resultElement.className = 'search-result-item';
                resultElement.innerHTML = `
                    <strong>${api.name}</strong>
                    <div class="small-text">${api.desc}</div>
                `;
                resultElement.addEventListener('click', () => {
                    highlightApi(api.name);
                });

                fragment.appendChild(resultElement);
            });

            searchResults.appendChild(fragment);
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No se encontraron coincidencias</div>';
            searchResults.style.display = 'block';
        }
    }

    // ✨ Resaltar API
    function highlightApi(apiName) {
        const apiElements = document.querySelectorAll('.api-item');
        apiElements.forEach(item => {
            if (item.querySelector('.col-name span').textContent === apiName) {
                item.scrollIntoView({ behavior: 'smooth' });
                item.style.animation = 'none';
                void item.offsetWidth;
                item.style.animation = 'highlight 1.5s';
                searchResults.style.display = 'none';
            }
        });
    }

    // Cerrar modal de preview
    closePreview.addEventListener('click', () => {
        previewModal.classList.add('hidden');
        previewContent.textContent = '';
    });

    // 🏁 Inicializar
    await loadApis();

    // 🌙 Tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

    // Eventos
    searchInput.addEventListener('input', handleSearch);
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
});
