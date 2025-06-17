// ===== ФИЛЬТРЫ ПО ДИЕТИЧЕСКИМ ПРЕДПОЧТЕНИЯМ =====
// Файл реализует функционал для фильтрации ингредиентов по диетическим предпочтениям

// Новая структура данных с разделами
const dietSections = [
    {
        title: 'Оздоровительные диеты',
        preferences: [
    { id: 'vegetarian', emoji: '🥗', name: 'Вегетарианство', description: 'Без мяса и рыбы' },
    { id: 'vegan', emoji: '🌱', name: 'Веганство', description: 'Только растительная пища' },
    { id: 'keto', emoji: '🥩', name: 'Кето-диета', description: 'Низкоуглеводная диета' },
    { id: 'paleo', emoji: '🦴', name: 'Палео-диета', description: 'Как питались предки' },
    { id: 'gluten-free', emoji: '🌾', name: 'Без глютена', description: 'Исключение глютеносодержащих продуктов' },
    { id: 'lactose-free', emoji: '🥛', name: 'Без лактозы', description: 'Исключение молочных продуктов' }
        ]
    },
    {
        title: 'Религиозные ограничения',
        preferences: [
            { id: 'halal', emoji: '🕌', name: 'Халяль', description: 'Без свинины' },
            { id: 'lent', emoji: '✝️', name: 'Христианский пост', description: 'Без мяса, яиц и молочного' },
            { id: 'kosher', emoji: '✡️', name: 'Кошер', description: 'Без свинины и морепродуктов' }
        ]
    }
];

// Карта ингредиентов, несовместимых с предпочтениями
const dietaryIncompatibility = {
    'vegetarian': ['meat', 'fish'],
    'vegan': ['meat', 'fish', 'dairy'],
    'keto': ['grains', 'fruits'],
    'paleo': ['grains', 'dairy'],
    'halal': [], // Особые правила
    'lent': ['meat', 'dairy'], // Особые правила
    'kosher': ['fish'], // Запрещены морепродукты (кроме рыбы с чешуей)
    'gluten-free': [],
    'lactose-free': []
};

// ID ингредиентов с особыми правилами
const porkIds = ['pork', 'ground_pork', 'bacon'];
const lentForbiddenIds = ['eggs', 'quail_eggs']; // Яйца запрещены в строгий пост
const kosherForbiddenIds = ['pork', 'ground_pork', 'bacon', 'shrimp', 'squid', 'mussels', 'crab_sticks', 'rabbit'];

// ID ингредиентов, содержащих глютен
const glutenContainingIds = [
    'bread', 'baguette', 'pasta', 'flour', 'lavash', 
    'couscous', 'oats', 'yeast', 'baking_powder',
    'cottage_cheese', 'sour_cream'
];

// ID ингредиентов, содержащих лактозу
const lactoseContainingIds = [
    'milk', 'cream', 'kefir', 'yogurt', 'butter', 
    'hard_cheese', 'parmesan', 'mozzarella', 'feta_cheese',
    'cottage_cheese', 'sour_cream'
];

// Активные фильтры диетических предпочтений
let activeDietaryFilters = [];
let currentDietSectionIndex = 0;

// Флаг наличия конфликтов между выбранными фильтрами
let hasFilterConflicts = false;

// Конфликтующие комбинации диет
const conflictingCombinations = [
    ['keto', 'vegan'],  // Кето и веганство сложно совместить из-за ограничений белка
    ['paleo', 'vegan']  // Палео и веганство тоже конфликтуют по питательным веществам
];

// Инициализация модуля фильтров
function initDietaryFilters() {
    console.log('🥦 Инициализация фильтров диетических предпочтений...');
    
    // Создаем элемент фильтров и вставляем его в DOM перед сеткой ингредиентов
    createDietaryFiltersUI();
    
    // Подписываемся на события фильтрации ингредиентов
    attachFilterEvents();
}

// Создание интерфейса фильтров диетических предпочтений
function createDietaryFiltersUI() {
    const filtersPanel = document.getElementById('filtersPanel');
    if (!filtersPanel) {
        console.error('Панель для фильтров не найдена!');
        return;
    }

    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'dietary-filters-container';
    filtersContainer.innerHTML = `
        <div class="dietary-filters-header">
            <button class="diet-nav-arrow" id="prevDietSection"><i class="fas fa-chevron-left"></i></button>
            <h3 id="dietSectionTitle"></h3>
            <button class="diet-nav-arrow" id="nextDietSection"><i class="fas fa-chevron-right"></i></button>
            <div class="conflict-warning" id="filterConflictWarning" style="display: none;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Выбранные фильтры могут конфликтовать</span>
            </div>
        </div>
        <div class="dietary-filters-grid" id="dietaryFiltersGrid">
            
        </div>
    `;
    
    filtersPanel.appendChild(filtersContainer);
    renderCurrentDietSection();

    document.getElementById('prevDietSection').addEventListener('click', () => navigateDietSections(-1));
    document.getElementById('nextDietSection').addEventListener('click', () => navigateDietSections(1));
}

// Навигация по разделам диет
function navigateDietSections(direction) {
    currentDietSectionIndex += direction;

    if (currentDietSectionIndex < 0) {
        currentDietSectionIndex = dietSections.length - 1;
    } else if (currentDietSectionIndex >= dietSections.length) {
        currentDietSectionIndex = 0;
    }

    renderCurrentDietSection();
}

// Отрисовка кнопок текущего раздела диет
function renderCurrentDietSection() {
    const currentSection = dietSections[currentDietSectionIndex];
    document.getElementById('dietSectionTitle').textContent = currentSection.title;
    
    const grid = document.getElementById('dietaryFiltersGrid');
    grid.innerHTML = currentSection.preferences.map(preference => {
        const isActive = activeDietaryFilters.includes(preference.id);
        return `
            <div class="dietary-filter-item ${isActive ? 'active' : ''}" data-preference="${preference.id}">
            <div class="filter-emoji">${preference.emoji}</div>
            <div class="filter-content">
                <div class="filter-name">${preference.name}</div>
                <div class="filter-description">${preference.description}</div>
            </div>
        </div>
        `
    }).join('');

    attachFilterEvents();
}

// Прикрепление событий к фильтрам
function attachFilterEvents() {
    // Находим все элементы фильтров
    const filterItems = document.querySelectorAll('.dietary-filter-item');
    
    // Добавляем обработчики событий для каждого фильтра
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            const preferenceId = item.dataset.preference;
            toggleDietaryFilter(preferenceId, item);
        });
    });
}

// Переключение состояния фильтра
function toggleDietaryFilter(preferenceId, element) {
    const index = activeDietaryFilters.indexOf(preferenceId);
    
    if (index >= 0) {
        // Если фильтр уже активен - удаляем его
        activeDietaryFilters.splice(index, 1);
        element.classList.remove('active');
    } else {
        // Если фильтр не активен - добавляем его
        activeDietaryFilters.push(preferenceId);
        element.classList.add('active');
    }
    
    // Проверяем на конфликты предпочтений
    checkForDietaryConflicts();
    
    // Применяем фильтрацию
    applyDietaryFilters();
}

// Проверка наличия конфликтов между выбранными фильтрами
function checkForDietaryConflicts() {
    hasFilterConflicts = false;
    
    // Если выбрано меньше 2 фильтров, конфликтов быть не может
    if (activeDietaryFilters.length < 2) {
        document.getElementById('filterConflictWarning').style.display = 'none';
        return;
    }
    
    // Проверяем наличие конфликтующих комбинаций
    for (const conflictPair of conflictingCombinations) {
        if (conflictPair.every(diet => activeDietaryFilters.includes(diet))) {
            hasFilterConflicts = true;
            document.getElementById('filterConflictWarning').style.display = 'flex';
            return;
        }
    }
    
    document.getElementById('filterConflictWarning').style.display = 'none';
}

// Проверка совместимости ингредиента с выбранными диетическими предпочтениями
function isIngredientCompatible(ingredient) {
    // Если нет активных фильтров, все ингредиенты совместимы
    if (activeDietaryFilters.length === 0) {
        return true;
    }
    
    // Проверяем каждое активное диетическое предпочтение
    for (const preference of activeDietaryFilters) {
        // Проверка для Халяль (без свинины)
        if (preference === 'halal' && porkIds.includes(ingredient.id)) {
            return false;
        }
        // Проверка для Поста (без яиц)
        if (preference === 'lent' && lentForbiddenIds.includes(ingredient.id)) {
            return false;
        }
        // Проверка для Кошер (без свинины и некоторых морепродуктов)
        if (preference === 'kosher' && kosherForbiddenIds.includes(ingredient.id)) {
            return false;
        }
        // Проверка для особого случая - без глютена
        if (preference === 'gluten-free' && glutenContainingIds.includes(ingredient.id)) {
            return false;
        }
        
        // Проверка для особого случая - без лактозы
        if (preference === 'lactose-free' && lactoseContainingIds.includes(ingredient.id)) {
            return false;
        }
        
        // Проверка для других диет - на основе категорий
        const incompatibleCategories = dietaryIncompatibility[preference] || [];
        if (incompatibleCategories.includes(ingredient.category)) {
            return false;
        }
    }
    
    return true;
}

// Применение фильтров к отображаемым ингредиентам
function applyDietaryFilters() {
    // Получаем текущий поисковый запрос и категорию
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const currentCategory = document.querySelector('.category-tab.active')?.dataset.category || 'all';
    
    // Применяем фильтры с учетом диетических предпочтений
    filterIngredientsWithDiet(searchQuery, currentCategory);
}

// Расширенная фильтрация с учетом диетических предпочтений
function filterIngredientsWithDiet(query, category) {
    // Используем стандартную фильтрацию по поиску и категории
    const baseFiltered = availableIngredients.filter(ingredient => {
        const matchesCategory = category === 'all' || ingredient.category === category;
        if (!matchesCategory) {
            return false;
        }

        if (query.trim() === '') {
            return true;
        }
        
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        const ingredientNameWords = ingredient.name.toLowerCase().split(' ');

        // Проверяем, соответствует ли ингредиент поисковому запросу
        const matchesSearch = searchTerms.every(searchTerm => {
            // Проверка прямого вхождения
            if (ingredient.name.toLowerCase().includes(searchTerm)) {
                return true;
            }

            // "Умный" поиск с допуском опечаток
            return ingredientNameWords.some(ingWord => {
                const distance = levenshteinDistance(searchTerm, ingWord);
                const threshold = Math.min(2, Math.floor(ingWord.length / 4));
                return distance <= threshold;
            });
        });

        return matchesSearch;
    });
    
    // Дополнительно фильтруем по диетическим предпочтениям
    filteredIngredients = baseFiltered.filter(isIngredientCompatible);
    
    // Обновляем отображение
    displayIngredients();
}

// Добавляем стили для фильтров
function injectDietaryFilterStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #mobileDietaryFilters {
            display: none;
        }

        /* Стили для контейнера диетических фильтров */
        .dietary-filters-container {
            margin-bottom: 20px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .dietary-filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            position: relative; /* Для позиционирования стрелок */
        }
        
        .dietary-filters-header h3 {
            font-size: 1.1rem; /* Немного уменьшим для баланса */
            margin: 0 10px;
            color: #333;
            font-weight: 700;
            text-align: center;
            flex-grow: 1;
        }
        
        .diet-nav-arrow {
            background: transparent;
            border: none;
            color: #f97316;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        .diet-nav-arrow:hover {
            background-color: rgba(249, 115, 22, 0.1);
        }
        
        .dietary-filters-header h3:before {
            content: ''; /* Убираем иконку, т.к. есть заголовок */
            margin-right: 0;
        }
        
        .conflict-warning {
            position: fixed;
            top: 85px;
            left: 50%;
            transform: translateX(-50%);
            width: auto;
            z-index: 9999;
            display: flex;
            align-items: center;
            color: #e74c3c;
            font-size: 0.9rem;
            background: rgba(231, 76, 60, 0.1);
            padding: 8px 14px;
            border-radius: 12px;
            animation: pulseWarning 2s infinite;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        @keyframes pulseWarning {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
        
        .conflict-warning i {
            margin-right: 8px;
        }
        
        .dietary-filters-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        /* Стили для отдельных фильтров */
        .dietary-filter-item {
            background: #f9fafb;
            border-radius: 14px;
            padding: 16px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: 2px solid #ebeef2;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        
        .dietary-filter-item:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0), transparent);
            transition: all 0.3s ease;
            opacity: 0;
        }
        
        .dietary-filter-item:hover {
            background: #f3f5f9;
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.04);
        }
        
        .dietary-filter-item.active {
            background: rgba(249, 115, 22, 0.08);
            border-color: #f97316;
            box-shadow: 0 5px 15px rgba(249, 115, 22, 0.1);
        }
        
        .dietary-filter-item.active:after {
            background: linear-gradient(90deg, #f97316, #fb923c, #f97316);
            opacity: 1;
        }
        
        .filter-emoji {
            font-size: 2rem;
            margin-right: 15px;
            transition: transform 0.3s ease;
        }
        
        .dietary-filter-item:hover .filter-emoji {
            transform: scale(1.1) rotate(5deg);
        }
        
        .dietary-filter-item.active .filter-emoji {
            animation: bounce 1s;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-12px);}
            60% {transform: translateY(-6px);}
        }
        
        .filter-content {
            flex: 1;
        }
        
        .filter-name {
            font-weight: 700;
            font-size: 1rem;
            margin-bottom: 5px;
            color: #111;
            transition: color 0.3s ease;
        }
        
        .dietary-filter-item.active .filter-name {
            color: #f97316;
        }
        
        .filter-description {
            font-size: 0.85rem;
            color: #6b7280;
            line-height: 1.4;
        }
        
        /* Адаптация для мобильных устройств */
        @media (max-width: 768px) {
            .right-sidebar, .cooking-basket-container {
                display: none; /* Скрываем боковую панель и корзину на мобильных */
            }

            .ingredients-body {
                grid-template-columns: 1fr; /* Одна колонка на мобильных */
            }

            #mobileDietaryFilters {
                display: block; /* Показываем мобильные фильтры */
                margin-bottom: 15px;
            }

            .mobile-filters-dropdown select {
                width: 100%;
                padding: 12px;
                background-color: #fff;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Создание выпадающего списка для мобильных устройств
function createMobileDietaryFilters() {
    const mobileContainer = document.getElementById('mobileDietaryFilters');
    if (!mobileContainer) return;

    // Собираем все опции из всех секций
    const allPreferences = dietSections.flatMap(section => section.preferences);

    mobileContainer.innerHTML = `
        <div class="mobile-filters-dropdown">
            <select id="mobileDietarySelect" class="form-control">
                <option value="">Все диеты</option>
                ${allPreferences.map(p => `<option value="${p.id}">${p.emoji} ${p.name}</option>`).join('')}
            </select>
        </div>
    `;

    document.getElementById('mobileDietarySelect').addEventListener('change', (e) => {
        const preferenceId = e.target.value;
        
        // Сбрасываем все активные фильтры и активируем один выбранный
        activeDietaryFilters = preferenceId ? [preferenceId] : [];
        
        // Обновляем состояние "больших" фильтров для консистентности
        document.querySelectorAll('.dietary-filter-item').forEach(item => {
            if (activeDietaryFilters.includes(item.dataset.preference)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        checkForDietaryConflicts();
        applyDietaryFilters();
    });
}

// Инициализируем модуль при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем стили
    injectDietaryFilterStyles();
    
    // Проверяем, загружен ли уже список ингредиентов
    if (typeof availableIngredients !== 'undefined') {
        // Запускаем инициализацию
        initDietaryFilters();
        createMobileDietaryFilters();
    } else {
        // Если ингредиенты еще не загружены, ждем их
        console.log('⏳ Ожидаем загрузки ингредиентов для инициализации фильтров...');
        // Проверяем наличие ингредиентов каждые 500мс
        const checkInterval = setInterval(() => {
            if (typeof availableIngredients !== 'undefined') {
                console.log('✅ Ингредиенты загружены, инициализируем фильтры');
                clearInterval(checkInterval);
                initDietaryFilters();
                createMobileDietaryFilters();
            }
        }, 500);
    }
}); 