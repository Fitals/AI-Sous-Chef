// culinary-extensions.js - Расширенная функциональность CulinaryChat Pro
// Подключается к основному файлу для реализации всех "затычек"

console.log('🔧 Загружаем расширения CulinaryChat Pro...');

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ РАСШИРЕНИЙ =====
let favoriteRecipes = [];
let recipeRatings = {};
let userPreferences = {
    dietaryRestrictions: [],
    allergies: [],
    preferredCuisines: [],
    difficulty: 'any'
};
let activeTimers = [];
let timerSound = null;

// ===== ИНИЦИАЛИЗАЦИЯ РАСШИРЕНИЙ =====
document.addEventListener('DOMContentLoaded', function() {
    initializeExtensions();
});

// Также пытаемся инициализироваться сразу, если DOM уже загружен
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initializeExtensions, 100);
}

function initializeExtensions() {
    console.log('🚀 Инициализируем расширения...');
    
    // Проверяем, были ли уже инициализированы расширения
    if (window.extensionsInitialized) {
        console.log('✅ Расширения уже инициализированы');
        return;
    }

    loadExtensionData();
    initializeFavorites();
    initializeHistory();
    initializeCalculator();
    initializeTimers();
    initializeExtendedProfile();
    
    // Переопределяем заглушки
    overrideStubFunctions();
    
    // Помечаем, что расширения инициализированы
    window.extensionsInitialized = true;
    
    console.log('✅ Все расширения загружены успешно!');
}

// ===== СИСТЕМА ИЗБРАННЫХ РЕЦЕПТОВ =====
function initializeFavorites() {
    console.log('💖 Инициализируем систему избранного...');
    displayFavoriteRecipes();

    // Используем делегирование событий для всех действий в секции
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection) {
        favoritesSection.addEventListener('click', (event) => {
            const viewBtn = event.target.closest('.view-recipe-btn');
            const removeBtn = event.target.closest('.remove-favorite');

            if (viewBtn) {
                const card = viewBtn.closest('.favorite-recipe-card');
                if (card) {
                    viewFullRecipe(viewBtn, card.dataset.id);
                }
            } else if (removeBtn) {
                const card = removeBtn.closest('.favorite-recipe-card');
                if (card) {
                    removeFavorite(removeBtn, card.dataset.id);
                }
            }
        });
    }
}

function toggleFavorite(button, recipeId) {
    const messageElement = button.closest('.message');
    
    // Получаем текст рецепта - ищем сначала первый div с текстом, затем весь текст сообщения
    const messageContent = messageElement.querySelector('div:not(.recipe-actions):not(.star-rating)');
    let recipeText = '';
    
    if (messageContent) {
        // Если есть подходящий div, берем его innerHTML для сохранения форматирования
        recipeText = messageContent.innerHTML;
    } else {
        // Иначе берем весь текст сообщения до кнопок
        const clone = messageElement.cloneNode(true);
        const actionsToRemove = clone.querySelectorAll('.recipe-actions, .star-rating');
        actionsToRemove.forEach(el => el.remove());
        recipeText = clone.innerHTML;
    }
    
    // Извлекаем данные рецепта
    const recipeData = {
        id: recipeId,
        title: extractRecipeTitle(recipeText),
        content: recipeText,
        date: new Date().toLocaleDateString('ru-RU'),
        timestamp: Date.now(),
        rating: recipeRatings[recipeId] || 0
    };

    const existingIndex = favoriteRecipes.findIndex(recipe => recipe.id === recipeId);
    
    if (existingIndex >= 0) {
        // Удаляем из избранного
        favoriteRecipes.splice(existingIndex, 1);
        button.classList.remove('active');
        button.innerHTML = '<i class="fas fa-heart"></i> В избранное';
        showNotification('Рецепт удален из избранного', 'warning');
    } else {
        // Добавляем в избранное
        favoriteRecipes.unshift(recipeData);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart"></i> В избранном';
        showNotification('Рецепт добавлен в избранное!', 'success');
    }
    
    saveExtensionData();
    displayFavoriteRecipes();
    updateBadges();
}

function extractRecipeTitle(text) {
    const titleMatch = text.match(/🍽️\s?\*\*(.*?)\*\*/);
    if (titleMatch) return titleMatch[1];
    
    const lines = text.split('\n');
    for (let line of lines) {
        if (line.trim() && !line.includes('Описание:') && !line.includes('Время:')) {
            return line.trim().substring(0, 50);
        }
    }
    return 'Рецепт ' + new Date().toLocaleTimeString('ru-RU');
}

function displayFavoriteRecipes() {
    const favoritesSection = document.querySelector('#favorites-section .favorites-section');
    
    if (!favoritesSection) {
        console.error('Секция избранных рецептов не найдена в DOM');
        return;
    }
    
    if (favoriteRecipes.length === 0) {
        favoritesSection.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Пока нет избранных рецептов</h3>
                <p>Добавляйте понравившиеся рецепты в избранное, и они появятся здесь</p>
            </div>
        `;
        return;
    }

    favoritesSection.innerHTML = `
        <div class="favorites-header">
            <div class="favorites-search">
                <input type="text" class="search-input" id="favoritesSearch" placeholder="Поиск в избранных рецептах...">
                <i class="fas fa-search search-icon"></i>
            </div>
            <div class="favorites-filters">
                <select id="favoritesSort" class="form-control">
                    <option value="date">По дате добавления</option>
                    <option value="rating">По рейтингу</option>
                    <option value="title">По названию</option>
                </select>
            </div>
        </div>
        <div class="favorites-grid" id="favoritesGrid">
            ${renderFavoriteRecipes(favoriteRecipes)}
        </div>
    `;

    // Добавляем обработчики
    const searchInput = document.getElementById('favoritesSearch');
    const sortSelect = document.getElementById('favoritesSort');
    
    if (searchInput) searchInput.addEventListener('input', filterFavorites);
    if (sortSelect) sortSelect.addEventListener('change', sortFavorites);
}

function renderFavoriteRecipes(recipes) {
    return recipes.map(recipe => `
        <div class="favorite-recipe-card" data-id="${recipe.id}">
            <div class="recipe-header">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-actions">
                    <div class="recipe-rating">
                        ${renderStars(recipe.rating, recipe.id)}
                    </div>
                    <button class="remove-favorite">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="recipe-preview">
                ${formatRecipePreview(recipe.content)}
            </div>
            <div class="recipe-footer">
                <span class="recipe-date">${recipe.date}</span>
                <button class="view-recipe-btn">
                    <i class="fas fa-eye"></i> Просмотреть
                </button>
            </div>
        </div>
    `).join('');
}

function formatRecipePreview(content) {
    const lines = content.split('\n');
    const preview = lines.slice(0, 4).join('<br>');
    return preview.length > 200 ? preview.substring(0, 200) + '...' : preview;
}

function renderStars(rating, recipeId) {
    return Array.from({length: 5}, (_, i) => 
        `<i class="fas fa-star star ${i < rating ? 'active' : ''}" 
           onclick="rateRecipe('${recipeId}', ${i + 1})"></i>`
    ).join('');
}

function removeFavorite(button, recipeId) {
    if (confirm('Вы уверены, что хотите удалить этот рецепт из избранного?')) {
        favoriteRecipes = favoriteRecipes.filter(recipe => recipe.id !== recipeId);
        saveExtensionData();
        
        // Удаляем карточку из DOM вместо полной перерисовки
        const card = button.closest('.favorite-recipe-card');
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                // Проверяем, не пустой ли список
                if (favoriteRecipes.length === 0) {
                    displayFavoriteRecipes();
                }
            }, 300);
        } else {
             displayFavoriteRecipes();
        }

        updateBadges();
        showNotification('Рецепт удален из избранного', 'success');
    }
}

function viewFullRecipe(button, recipeId) {
    const recipe = favoriteRecipes.find(r => r.id === recipeId);
    const card = button.closest('.favorite-recipe-card');
    
    if (!recipe || !card) {
        showNotification('Не удалось найти рецепт!', 'error');
        return;
    }
    
    const previewEl = card.querySelector('.recipe-preview');
    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
        // Сворачиваем
        previewEl.innerHTML = formatRecipePreview(recipe.content);
        card.classList.remove('expanded');
        button.innerHTML = `<i class="fas fa-eye"></i> Просмотреть`;
    } else {
        // Разворачиваем
        previewEl.innerHTML = recipe.content;
        card.classList.add('expanded');
        button.innerHTML = `<i class="fas fa-eye-slash"></i> Свернуть`;
    }
}

function filterFavorites() {
    const query = document.getElementById('favoritesSearch').value.toLowerCase();
    const filtered = favoriteRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query) || 
        recipe.content.toLowerCase().includes(query)
    );
    
    document.getElementById('favoritesGrid').innerHTML = renderFavoriteRecipes(filtered);
}

function sortFavorites() {
    const sortBy = document.getElementById('favoritesSort').value;
    const sorted = [...favoriteRecipes];
    
    switch(sortBy) {
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'date':
        default:
            sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    document.getElementById('favoritesGrid').innerHTML = renderFavoriteRecipes(sorted);
}

// ===== СИСТЕМА РЕЙТИНГОВ =====
function rateRecipe(recipeId, rating) {
    // Сохраняем рейтинг
    recipeRatings[recipeId] = rating;
    
    // Обновляем в избранном
    const favoriteIndex = favoriteRecipes.findIndex(recipe => recipe.id === recipeId);
    if (favoriteIndex >= 0) {
        favoriteRecipes[favoriteIndex].rating = rating;
    }
    
    // Обновляем визуально все звезды для этого рецепта
    document.querySelectorAll(`[onclick*="${recipeId}"]`).forEach(star => {
        const starRating = parseInt(star.getAttribute('onclick').match(/(\d+)\)$/)[1]);
        star.classList.toggle('active', starRating <= rating);
    });
    
    saveExtensionData();
    showNotification(`Рецепт оценен на ${rating} звезд!`, 'success');
}

// ===== ИСТОРИЯ ЧАТОВ =====
function initializeHistory() {
    console.log('📚 Инициализируем историю чатов...');
    displayChatHistory();
}

function displayChatHistory() {
    const historySection = document.querySelector('#history-section .history-section');
    
    if (chatHistory.length === 0) {
        historySection.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>История чатов пуста</h3>
                <p>Начните общение с кулинарным помощником, и ваши беседы сохранятся здесь</p>
            </div>
        `;
        return;
    }

    historySection.innerHTML = `
        <div class="history-header">
            <div class="history-search">
                <input type="text" class="search-input" id="historySearch" placeholder="Поиск в истории чатов...">
                <i class="fas fa-search search-icon"></i>
            </div>
            <div class="history-actions">
                <button class="action-btn secondary" onclick="exportChatHistory()">
                    <i class="fas fa-download"></i> Экспорт
                </button>
                <button class="action-btn" onclick="clearChatHistory()">
                    <i class="fas fa-trash"></i> Очистить всю историю
                </button>
            </div>
        </div>
        <div class="history-list" id="historyList">
            ${renderChatHistory(chatHistory)}
        </div>
    `;

    // Добавляем обработчик поиска
    document.getElementById('historySearch').addEventListener('input', filterHistory);
}

function renderChatHistory(chats) {
    return chats.map(chat => `
        <div class="history-item" data-id="${chat.id}" onclick="viewChat('${chat.id}')">
            <div class="history-item-info">
                <div class="history-item-icon">
                    <i class="fas fa-comment-alt"></i>
                </div>
                <div class="history-item-details">
                    <div class="history-item-title">${chat.title}</div>
                    <div class="history-item-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${chat.date}</span>
                        <span><i class="fas fa-comments"></i> ${chat.messages.length} сообщений</span>
                    </div>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="history-item-btn continue" onclick="event.stopPropagation(); resumeChat('${chat.id}');">
                    <i class="fas fa-play"></i> Продолжить
                </button>
                <button class="history-item-btn" onclick="event.stopPropagation(); deleteChatFromHistory('${chat.id}');">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        </div>
    `).join('');
}

function getChatPreview(messages) {
    const lastUserMessage = messages.filter(msg => msg.type === 'user').pop();
    const lastBotMessage = messages.filter(msg => msg.type === 'bot').pop();
    
    let preview = '';
    if (lastUserMessage) {
        preview += `<div class="preview-user">👤 ${lastUserMessage.text.substring(0, 100)}${lastUserMessage.text.length > 100 ? '...' : ''}</div>`;
    }
    if (lastBotMessage) {
        preview += `<div class="preview-bot">👨‍🍳 ${lastBotMessage.text.substring(0, 100)}${lastBotMessage.text.length > 100 ? '...' : ''}</div>`;
    }
    
    return preview;
}

function viewChat(chatId) {
    const chat = chatHistory.find(c => c.id == chatId);
    if (!chat) return;

    // Создаем модальное окно для просмотра чата
    const modal = document.createElement('div');
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${chat.title}</h3>
                <button class="close-modal" onclick="this.closest('.chat-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="chat-messages">
                    ${chat.messages.map(msg => `
                        <div class="message ${msg.type}">
                            ${formatMessage(msg.text)}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="action-btn" onclick="resumeChat('${chatId}'); this.closest('.chat-modal').remove();">
                    <i class="fas fa-play"></i> Продолжить этот чат
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function resumeChat(chatId) {
    const chat = chatHistory.find(c => c.id == chatId);
    if (!chat) return;

    // Переключаемся на чат
    switchSection('chat');
    
    // Очищаем текущие сообщения и загружаем из истории
    messagesContainer.innerHTML = '';
    currentMessages = [...chat.messages];
    currentChatId = chatId;
    
    // Отображаем сообщения
    currentMessages.forEach(msg => {
        if (msg.type === 'user') {
            addUserMessage(msg.text, false);
        } else {
            addBotMessage(msg.text, msg.recipeData, false);
        }
    });
    
    hideSuggestions();
    showNotification('Чат возобновлен!', 'success');
}

function deleteChatFromHistory(chatId) {
    if (confirm('Вы уверены, что хотите удалить этот чат?')) {
        chatHistory = chatHistory.filter(c => c.id != chatId);
        saveChatHistory();
        displayChatHistory();
        updateBadges();
        showNotification('Чат удален из истории', 'success');
    }
}

function filterHistory() {
    const query = document.getElementById('historySearch').value.toLowerCase();
    const filtered = chatHistory.filter(chat => 
        chat.title.toLowerCase().includes(query) ||
        chat.messages.some(msg => msg.text.toLowerCase().includes(query))
    );
    
    document.getElementById('historyList').innerHTML = renderChatHistory(filtered);
}

function clearChatHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю чатов? Это действие нельзя отменить.')) {
        chatHistory = [];
        currentMessages = [];
        currentChatId = null;
        saveChatHistory();
        displayChatHistory();
        updateBadges();
        showNotification('История чатов очищена', 'success');
    }
}

function exportChatHistory() {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `culinary-chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('История чатов экспортирована', 'success');
}

// ===== КАЛЬКУЛЯТОР ПОРЦИЙ =====
function initializeCalculator() {
    console.log('🧮 Инициализируем калькулятор порций...');
    
    const calculatorSection = document.querySelector('#calculator-section .calculator-section');
    calculatorSection.innerHTML = `
        <div class="calculator-card">
            <h2><i class="fas fa-calculator"></i> Калькулятор порций и калорий</h2>
            <div class="calculator-content">
                <div class="calculator-input">
                    <div class="form-group">
                        <label class="form-label">Текущее количество порций</label>
                        <input type="number" class="form-control" id="currentPortions" value="4" min="1" max="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Желаемое количество порций</label>
                        <input type="number" class="form-control" id="desiredPortions" value="6" min="1" max="100">
                    </div>
                    <button class="action-btn" onclick="calculatePortions()">
                        <i class="fas fa-magic"></i> Пересчитать ингредиенты
                    </button>
                </div>
                
                <div class="calculator-results" id="calculatorResults">
                    <div class="empty-state">
                        <i class="fas fa-utensils"></i>
                        <h3>Выберите рецепт для расчета</h3>
                        <p>Получите рецепт в чате, затем используйте кнопку "Калькулятор порций"</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="calculator-card">
            <h3><i class="fas fa-balance-scale"></i> Конвертер единиц измерения</h3>
            <div class="converter-content">
                <div class="converter-input">
                    <input type="number" class="form-control" id="convertValue" placeholder="Количество">
                    <select class="form-control" id="fromUnit">
                        <option value="г">граммы</option>
                        <option value="кг">килограммы</option>
                        <option value="мл">миллилитры</option>
                        <option value="л">литры</option>
                        <option value="ст.л.">столовые ложки</option>
                        <option value="ч.л.">чайные ложки</option>
                        <option value="стакан">стаканы</option>
                    </select>
                    <span>→</span>
                    <select class="form-control" id="toUnit">
                        <option value="кг">килограммы</option>
                        <option value="г">граммы</option>
                        <option value="л">литры</option>
                        <option value="мл">миллилитры</option>
                        <option value="ст.л.">столовые ложки</option>
                        <option value="ч.л.">чайные ложки</option>
                        <option value="стакан">стаканы</option>
                    </select>
                    <button class="action-btn secondary" onclick="convertUnits()">
                        <i class="fas fa-exchange-alt"></i> Конвертировать
                    </button>
                </div>
                <div class="converter-result" id="converterResult"></div>
            </div>
        </div>
    `;
}

let currentRecipeForCalculation = null;

function showPortionCalculator(recipeText) {
    currentRecipeForCalculation = recipeText;
    switchSection('calculator');
    
    const calculatorResults = document.getElementById('calculatorResults');
    calculatorResults.innerHTML = `
        <div class="recipe-for-calculation">
            <h4>Рецепт для пересчета:</h4>
            <div class="recipe-preview">
                ${formatMessage(recipeText.substring(0, 300))}...
            </div>
            <button class="action-btn" onclick="calculatePortions()">
                <i class="fas fa-calculator"></i> Пересчитать сейчас
            </button>
        </div>
    `;
    
    showNotification('Рецепт загружен в калькулятор!', 'success');
}

function calculatePortions() {
    if (!currentRecipeForCalculation) {
        showNotification('Сначала выберите рецепт в чате', 'warning');
        return;
    }
    
    const currentPortions = parseInt(document.getElementById('currentPortions').value);
    const desiredPortions = parseInt(document.getElementById('desiredPortions').value);
    
    if (!currentPortions || !desiredPortions) {
        showNotification('Укажите количество порций', 'error');
        return;
    }
    
    const multiplier = desiredPortions / currentPortions;
    const recalculatedRecipe = recalculateIngredients(currentRecipeForCalculation, multiplier);
    
    const resultsDiv = document.getElementById('calculatorResults');
    resultsDiv.innerHTML = `
        <div class="calculation-results">
            <div class="calculation-header">
                <h4>Пересчитанный рецепт (${desiredPortions} порций)</h4>
                <div class="multiplier-info">Коэффициент: ×${multiplier.toFixed(2)}</div>
            </div>
            <div class="recalculated-recipe">
                ${formatMessage(recalculatedRecipe)}
            </div>
            <div class="calculation-actions">
                <button class="action-btn" onclick="copyToChat()">
                    <i class="fas fa-copy"></i> Копировать в чат
                </button>
                <button class="action-btn secondary" onclick="saveRecalculatedRecipe()">
                    <i class="fas fa-save"></i> Сохранить рецепт
                </button>
            </div>
        </div>
    `;
}

function recalculateIngredients(recipeText, multiplier) {
    // Простая система пересчета - ищем числа перед единицами измерения
    const units = ['г', 'кг', 'мл', 'л', 'ст.л.', 'ч.л.', 'шт', 'стакан', 'стакана', 'стаканов'];
    
    let recalculatedText = recipeText;
    
    // Регулярное выражение для поиска количества с единицами измерения
    const regex = /(\d+(?:\.\d+)?)\s*(г|кг|мл|л|ст\.л\.|ч\.л\.|шт|стакан[а-я]*)/gi;
    
    recalculatedText = recalculatedText.replace(regex, (match, number, unit) => {
        const originalAmount = parseFloat(number);
        const newAmount = originalAmount * multiplier;
        
        // Округляем до разумного количества знаков
        const roundedAmount = newAmount < 1 ? 
            Math.round(newAmount * 100) / 100 : 
            Math.round(newAmount * 10) / 10;
        
        return `${roundedAmount} ${unit}`;
    });
    
    return recalculatedText;
}

function convertUnits() {
    const value = parseFloat(document.getElementById('convertValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (!value) {
        showNotification('Введите количество для конвертации', 'error');
        return;
    }
    
    const result = performUnitConversion(value, fromUnit, toUnit);
    const resultDiv = document.getElementById('converterResult');
    
    if (result !== null) {
        resultDiv.innerHTML = `
            <div class="conversion-result">
                <strong>${value} ${fromUnit} = ${result} ${toUnit}</strong>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="conversion-error">
                Невозможно конвертировать ${fromUnit} в ${toUnit}
            </div>
        `;
    }
}

function performUnitConversion(value, from, to) {
    const conversions = {
        'г': { 'кг': 0.001, 'г': 1 },
        'кг': { 'г': 1000, 'кг': 1 },
        'мл': { 'л': 0.001, 'мл': 1, 'ст.л.': 0.067, 'ч.л.': 0.2, 'стакан': 0.004 },
        'л': { 'мл': 1000, 'л': 1, 'ст.л.': 67, 'ч.л.': 200, 'стакан': 4 },
        'ст.л.': { 'мл': 15, 'л': 0.015, 'ст.л.': 1, 'ч.л.': 0.33 },
        'ч.л.': { 'мл': 5, 'л': 0.005, 'ст.л.': 3, 'ч.л.': 1 },
        'стакан': { 'мл': 250, 'л': 0.25, 'стакан': 1 }
    };
    
    if (conversions[from] && conversions[from][to]) {
        const result = value * conversions[from][to];
        return Math.round(result * 1000) / 1000; // Округляем до 3 знаков
    }
    
    return null;
}

function copyToChat() {
    const recipeContent = document.querySelector('.recalculated-recipe').textContent;
    switchSection('chat');
    addBotMessage(recipeContent, null, false);
    showNotification('Пересчитанный рецепт скопирован в чат!', 'success');
}

// ===== СИСТЕМА ТАЙМЕРОВ =====
function initializeTimers() {
    console.log('⏱️ Инициализируем систему таймеров...');
    displayTimers();
    
    // Инициализируем звук уведомления
    initializeTimerSound();
}

function initializeTimerSound() {
    // Создаем простой звук уведомления
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createBeep(frequency, duration, volume) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    timerSound = () => {
        // Тройной сигнал
        createBeep(800, 0.2, 0.3);
        setTimeout(() => createBeep(800, 0.2, 0.3), 300);
        setTimeout(() => createBeep(800, 0.4, 0.3), 600);
    };
}

function displayTimers() {
    const timersSection = document.querySelector('#timers-section .timers-section');
    
    timersSection.innerHTML = `
        <div class="timers-header">
            <h2><i class="fas fa-stopwatch"></i> Кулинарные таймеры</h2>
            <button class="action-btn" onclick="showAddTimerForm()">
                <i class="fas fa-plus"></i> Добавить таймер
            </button>
        </div>
        
        <div class="add-timer-form" id="addTimerForm" style="display: none;">
            <div class="form-group">
                <label class="form-label">Название таймера</label>
                <input type="text" class="form-control" id="timerName" placeholder="Например: Варка яиц">
            </div>
            <div class="timer-duration">
                <div class="form-group">
                    <label class="form-label">Минуты</label>
                    <input type="number" class="form-control" id="timerMinutes" value="5" min="0" max="999">
                </div>
                <div class="form-group">
                    <label class="form-label">Секунды</label>
                    <input type="number" class="form-control" id="timerSeconds" value="0" min="0" max="59">
                </div>
            </div>
            <div class="form-actions">
                <button class="action-btn" onclick="createTimer()">
                    <i class="fas fa-play"></i> Создать и запустить
                </button>
                <button class="action-btn secondary" onclick="hideAddTimerForm()">
                    <i class="fas fa-times"></i> Отмена
                </button>
            </div>
        </div>
        
        <div class="timers-list" id="timersList">
            ${renderTimers()}
        </div>
    `;
}

function renderTimers() {
    if (activeTimers.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-stopwatch"></i>
                <h3>Нет активных таймеров</h3>
                <p>Создайте таймер для отслеживания времени готовки</p>
            </div>
        `;
    }
    
    return activeTimers.map(timer => `
        <div class="timer-card ${timer.isRunning ? 'running' : 'paused'}" data-id="${timer.id}">
            <div class="timer-header">
                <h4 class="timer-name">${timer.name}</h4>
                <div class="timer-controls">
                    <button class="timer-btn ${timer.isRunning ? 'pause' : 'play'}" 
                            onclick="toggleTimer('${timer.id}')">
                        <i class="fas fa-${timer.isRunning ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="timer-btn reset" onclick="resetTimer('${timer.id}')">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="timer-btn delete" onclick="deleteTimer('${timer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="timer-display">
                <div class="time-remaining" id="timer-${timer.id}">
                    ${formatTime(timer.remainingTime)}
                </div>
                <div class="timer-progress">
                    <div class="progress-bar" style="width: ${getTimerProgress(timer)}%"></div>
                </div>
            </div>
            <div class="timer-info">
                <span class="original-duration">Исходное время: ${formatTime(timer.originalDuration)}</span>
                <span class="timer-status">${getTimerStatus(timer)}</span>
            </div>
        </div>
    `).join('');
}

function showAddTimerForm() {
    document.getElementById('addTimerForm').style.display = 'block';
    document.getElementById('timerName').focus();
}

function hideAddTimerForm() {
    document.getElementById('addTimerForm').style.display = 'none';
    document.getElementById('timerName').value = '';
    document.getElementById('timerMinutes').value = '5';
    document.getElementById('timerSeconds').value = '0';
}

function createTimer() {
    const name = document.getElementById('timerName').value.trim();
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    
    if (!name) {
        showNotification('Введите название таймера', 'error');
        return;
    }
    
    if (minutes === 0 && seconds === 0) {
        showNotification('Установите время таймера', 'error');
        return;
    }
    
    const totalSeconds = minutes * 60 + seconds;
    const timer = {
        id: Date.now().toString(),
        name: name,
        originalDuration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: true,
        startTime: Date.now(),
        pausedTime: 0
    };
    
    activeTimers.unshift(timer);
    hideAddTimerForm();
    displayTimers();
    updateBadges();
    
    showNotification(`Таймер "${name}" запущен!`, 'success');
    
    // Запускаем обновление таймера
    startTimerUpdate(timer.id);
}

function toggleTimer(timerId) {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return;
    
    timer.isRunning = !timer.isRunning;
    
    if (timer.isRunning) {
        // Возобновляем таймер
        timer.startTime = Date.now() - timer.pausedTime;
        startTimerUpdate(timerId);
        showNotification(`Таймер "${timer.name}" возобновлен`, 'success');
    } else {
        // Ставим на паузу
        timer.pausedTime = Date.now() - timer.startTime;
        showNotification(`Таймер "${timer.name}" на паузе`, 'warning');
    }
    
    displayTimers();
}

function resetTimer(timerId) {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return;
    
    timer.remainingTime = timer.originalDuration;
    timer.isRunning = false;
    timer.startTime = 0;
    timer.pausedTime = 0;
    
    displayTimers();
    showNotification(`Таймер "${timer.name}" сброшен`, 'success');
}

function deleteTimer(timerId) {
    const timer = activeTimers.find(t => t.id === timerId);
    if (!timer) return;
    
    if (confirm(`Удалить таймер "${timer.name}"?`)) {
        activeTimers = activeTimers.filter(t => t.id !== timerId);
        displayTimers();
        updateBadges();
        showNotification('Таймер удален', 'success');
    }
}

function startTimerUpdate(timerId) {
    const updateInterval = setInterval(() => {
        const timer = activeTimers.find(t => t.id === timerId);
        
        if (!timer || !timer.isRunning) {
            clearInterval(updateInterval);
            return;
        }
        
        const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        timer.remainingTime = Math.max(0, timer.originalDuration - elapsed);
        
        // Обновляем отображение
        const display = document.getElementById(`timer-${timerId}`);
        if (display) {
            display.textContent = formatTime(timer.remainingTime);
            
            // Обновляем прогресс-бар
            const progressBar = display.parentElement.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = getTimerProgress(timer) + '%';
            }
        }
        
        // Проверяем завершение
        if (timer.remainingTime <= 0) {
            clearInterval(updateInterval);
            onTimerComplete(timer);
        }
    }, 1000);
}

function onTimerComplete(timer) {
    timer.isRunning = false;
    
    // Играем звук
    if (timerSound) {
        timerSound();
    }
    
    // Показываем уведомление
    showTimerCompleteNotification(timer);
    
    // Обновляем отображение
    displayTimers();
    
    // Если разрешены системные уведомления
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Таймер завершен: ${timer.name}`, {
            body: 'Время вышло!',
            icon: '🍳'
        });
    }
}

function showTimerCompleteNotification(timer) {
    const notification = document.createElement('div');
    notification.className = 'timer-complete-notification';
    notification.innerHTML = `
        <div class="timer-complete-content">
            <div class="timer-complete-icon">⏰</div>
            <div class="timer-complete-text">
                <h3>Время вышло!</h3>
                <p>Таймер "${timer.name}" завершен</p>
            </div>
            <div class="timer-complete-actions">
                <button class="action-btn" onclick="resetTimer('${timer.id}'); this.closest('.timer-complete-notification').remove();">
                    <i class="fas fa-redo"></i> Перезапустить
                </button>
                <button class="action-btn secondary" onclick="this.closest('.timer-complete-notification').remove();">
                    <i class="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматически убираем через 10 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getTimerProgress(timer) {
    return Math.max(0, Math.min(100, 
        ((timer.originalDuration - timer.remainingTime) / timer.originalDuration) * 100
    ));
}

function getTimerStatus(timer) {
    if (timer.remainingTime <= 0) return 'Завершен';
    if (timer.isRunning) return 'Идет';
    return 'На паузе';
}

// ===== РАСШИРЕННЫЙ ПРОФИЛЬ =====
function initializeExtendedProfile() {
    console.log('👤 Расширяем профиль пользователя...');
    
    const profileSection = document.querySelector('#profile-section .profile-section');
    profileSection.innerHTML = `
        <div class="profile-card">
            <h2><i class="fas fa-user-chef"></i> Основная информация</h2>
            <div class="form-group">
                <label class="form-label">Имя пользователя</label>
                <input type="text" class="form-control" id="userName" value="${userProfile.name}" placeholder="Введите ваше имя">
            </div>
            <div class="form-group">
                <label class="form-label">Уровень кулинарного мастерства</label>
                <select class="form-control" id="cookingLevel">
                    <option value="beginner" ${userProfile.level === 'beginner' ? 'selected' : ''}>Новичок</option>
                    <option value="intermediate" ${userProfile.level === 'intermediate' ? 'selected' : ''}>Любитель</option>
                    <option value="advanced" ${userProfile.level === 'advanced' ? 'selected' : ''}>Опытный</option>
                    <option value="expert" ${userProfile.level === 'expert' ? 'selected' : ''}>Эксперт</option>
                </select>
            </div>
        </div>
        
        <div class="profile-card">
            <h3><i class="fas fa-heart"></i> Диетические предпочтения</h3>
            <div class="preferences-grid">
                ${renderDietaryPreferences()}
            </div>
        </div>
        
        <div class="profile-card">
            <h3><i class="fas fa-exclamation-triangle"></i> Аллергии и ограничения</h3>
            <div class="allergies-input">
                <input type="text" class="form-control" id="newAllergy" placeholder="Добавить аллерген...">
                <button class="action-btn secondary" onclick="addAllergy()">
                    <i class="fas fa-plus"></i> Добавить
                </button>
            </div>
            <div class="allergies-list" id="allergiesList">
                ${renderAllergies()}
            </div>
        </div>
        
        <div class="profile-card">
            <h3><i class="fas fa-globe"></i> Предпочтения по кухням</h3>
            <div class="cuisines-grid">
                ${renderCuisinePreferences()}
            </div>
        </div>
        
        <div class="profile-actions">
            <button class="action-btn" onclick="saveExtendedProfile()">
                <i class="fas fa-save"></i> Сохранить все настройки
            </button>
            <button class="action-btn secondary" onclick="resetProfile()">
                <i class="fas fa-undo"></i> Сбросить к умолчаниям
            </button>
        </div>
    `;
}

function renderDietaryPreferences() {
    const dietaryOptions = [
        { id: 'vegetarian', name: '🥗 Вегетарианство', description: 'Без мяса и рыбы' },
        { id: 'vegan', name: '🌱 Веганство', description: 'Только растительная пища' },
        { id: 'keto', name: '🥩 Кето-диета', description: 'Низкоуглеводная диета' },
        { id: 'paleo', name: '🦴 Палео-диета', description: 'Как питались предки' },
        { id: 'gluten-free', name: '🌾 Без глютена', description: 'Исключение глютеносодержащих продуктов' },
        { id: 'lactose-free', name: '🥛 Без лактозы', description: 'Исключение молочных продуктов' }
    ];
    
    return dietaryOptions.map(option => `
        <div class="preference-item">
            <label class="preference-label">
                <input type="checkbox" 
                       ${userPreferences.dietaryRestrictions.includes(option.id) ? 'checked' : ''}
                       onchange="toggleDietaryPreference('${option.id}')">
                <div class="preference-content">
                    <div class="preference-name">${option.name}</div>
                    <div class="preference-description">${option.description}</div>
                </div>
            </label>
        </div>
    `).join('');
}

function renderAllergies() {
    if (userPreferences.allergies.length === 0) {
        return '<p class="no-allergies">Аллергии не указаны</p>';
    }
    
    return userPreferences.allergies.map(allergy => `
        <div class="allergy-tag">
            <span>${allergy}</span>
            <button onclick="removeAllergy('${allergy}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function renderCuisinePreferences() {
    const cuisines = [
        '🇷🇺 Русская', '🇮🇹 Итальянская', '🇫🇷 Французская', '🇯🇵 Японская',
        '🇨🇳 Китайская', '🇮🇳 Индийская', '🇲🇽 Мексиканская', '🇹🇭 Тайская',
        '🇬🇷 Греческая', '🇪🇸 Испанская', '🇰🇷 Корейская', '🇹🇷 Турецкая'
    ];
    
    return cuisines.map(cuisine => `
        <div class="cuisine-item">
            <label class="cuisine-label">
                <input type="checkbox" 
                       ${userPreferences.preferredCuisines.includes(cuisine) ? 'checked' : ''}
                       onchange="toggleCuisinePreference('${cuisine}')">
                <span>${cuisine}</span>
            </label>
        </div>
    `).join('');
}

function toggleDietaryPreference(preferenceId) {
    const index = userPreferences.dietaryRestrictions.indexOf(preferenceId);
    if (index >= 0) {
        userPreferences.dietaryRestrictions.splice(index, 1);
    } else {
        userPreferences.dietaryRestrictions.push(preferenceId);
    }
}

function addAllergy() {
    const input = document.getElementById('newAllergy');
    const allergy = input.value.trim();
    
    if (!allergy) return;
    
    if (!userPreferences.allergies.includes(allergy)) {
        userPreferences.allergies.push(allergy);
        input.value = '';
        document.getElementById('allergiesList').innerHTML = renderAllergies();
    }
}

function removeAllergy(allergy) {
    userPreferences.allergies = userPreferences.allergies.filter(a => a !== allergy);
    document.getElementById('allergiesList').innerHTML = renderAllergies();
}

function toggleCuisinePreference(cuisine) {
    const index = userPreferences.preferredCuisines.indexOf(cuisine);
    if (index >= 0) {
        userPreferences.preferredCuisines.splice(index, 1);
    } else {
        userPreferences.preferredCuisines.push(cuisine);
    }
}

function saveExtendedProfile() {
    // Сохраняем основные данные
    userProfile.name = document.getElementById('userName').value;
    userProfile.level = document.getElementById('cookingLevel').value;
    
    saveExtensionData();
    showNotification('Профиль успешно сохранен!', 'success');
}

function resetProfile() {
    if (confirm('Сбросить все настройки профиля к умолчаниям?')) {
        userProfile = {
            name: 'Кулинар',
            level: 'beginner'
        };
        userPreferences = {
            dietaryRestrictions: [],
            allergies: [],
            preferredCuisines: [],
            difficulty: 'any'
        };
        
        saveExtensionData();
        initializeExtendedProfile();
        showNotification('Профиль сброшен к умолчаниям', 'success');
    }
}

// ===== ПЕРЕОПРЕДЕЛЕНИЕ ЗАГЛУШЕК =====
function overrideStubFunctions() {
    console.log('🔄 Переопределяем заглушки...');
    
    // Экспортируем нашу функцию toggleFavorite в глобальный контекст
    window.toggleFavorite = toggleFavorite;
    
    // Экспортируем функцию rateRecipe
    window.rateRecipe = rateRecipe;
    
    // Переопределяем кнопку калькулятора порций в рецептах
    window.showPortionCalculator = showPortionCalculator;
    
    // Добавляем обработчик кнопки калькулятора в существующие рецепты
    document.addEventListener('click', function(e) {
        if (e.target.closest('[onclick*="Функция в разработке"]')) {
            e.preventDefault();
            e.stopPropagation();
            
            const messageElement = e.target.closest('.message');
            if (messageElement) {
                const recipeText = messageElement.textContent;
                showPortionCalculator(recipeText);
            }
        }
    });
    
    // Запрашиваем разрешение на уведомления для таймеров
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА ДАННЫХ РАСШИРЕНИЙ =====
function saveExtensionData() {
    try {
        localStorage.setItem('culinaryChat_favorites', JSON.stringify(favoriteRecipes));
        localStorage.setItem('culinaryChat_ratings', JSON.stringify(recipeRatings));
        localStorage.setItem('culinaryChat_preferences', JSON.stringify(userPreferences));
        localStorage.setItem('culinaryChat_timers', JSON.stringify(activeTimers));
        localStorage.setItem('culinaryChat_userProfile', JSON.stringify(userProfile));
    } catch (error) {
        console.error('Ошибка сохранения данных расширений:', error);
    }
}

function loadExtensionData() {
    try {
        const savedFavorites = localStorage.getItem('culinaryChat_favorites');
        if (savedFavorites) {
            favoriteRecipes = JSON.parse(savedFavorites);
        }
        
        const savedRatings = localStorage.getItem('culinaryChat_ratings');
        if (savedRatings) {
            recipeRatings = JSON.parse(savedRatings);
        }
        
        const savedPreferences = localStorage.getItem('culinaryChat_preferences');
        if (savedPreferences) {
            userPreferences = {...userPreferences, ...JSON.parse(savedPreferences)};
        }
        
        const savedTimers = localStorage.getItem('culinaryChat_timers');
        if (savedTimers) {
            activeTimers = JSON.parse(savedTimers);
            // Сбрасываем все таймеры при загрузке (они не должны работать между сессиями)
            activeTimers.forEach(timer => {
                timer.isRunning = false;
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки данных расширений:', error);
    }
}

// ===== ПЕРЕОПРЕДЕЛЕНИЕ UPDATEBADGES =====
const originalUpdateBadges = window.updateBadges;
window.updateBadges = function() {
    // Вызываем оригинальную функцию
    if (originalUpdateBadges) {
        originalUpdateBadges();
    }
    
    // Обновляем наши счетчики
    const favoritesCount = document.getElementById('favoritesCount');
    const timersCount = document.getElementById('timersCount');
    
    if (favoritesCount) {
        favoritesCount.textContent = favoriteRecipes.length;
        favoritesCount.style.display = favoriteRecipes.length > 0 ? 'inline-block' : 'none';
    }
    
    if (timersCount) {
        const runningTimers = activeTimers.filter(t => t.isRunning).length;
        timersCount.textContent = runningTimers;
        timersCount.style.display = runningTimers > 0 ? 'inline-block' : 'none';
    }
};

// ===== АВТОСОХРАНЕНИЕ РАСШИРЕНИЙ =====
setInterval(() => {
    saveExtensionData();
}, 60000); // Каждую минуту

// ===== ОБРАБОТКА ЗАКРЫТИЯ СТРАНИЦЫ =====
window.addEventListener('beforeunload', () => {
    saveExtensionData();
});

console.log('🎉 CulinaryChat Pro Extensions загружены! Версия 1.0');

function hideSuggestions() {
    const suggestionsContainer = document.querySelector('.initial-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            suggestionsContainer.style.display = 'none';
        }, 500);
    }
}

function showSuggestions() {
    const suggestionsContainer = document.querySelector('.initial-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'block';
        suggestionsContainer.style.animation = 'fadeIn 0.5s ease-out';
    }
}
