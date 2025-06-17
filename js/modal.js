function openCustomIngredientModal() {
    const searchInput = document.getElementById('searchInput');
    const modalNameInput = document.getElementById('customIngredientName');
    if (modalNameInput && searchInput) {
        modalNameInput.value = searchInput.value;
    }

    const modal = document.getElementById('addCustomIngredientModal');
    if (modal) {
        modal.classList.add('visible');
    }
}

function closeCustomIngredientModal() {
    const modal = document.getElementById('addCustomIngredientModal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

function submitCustomIngredient() {
    const nameInput = document.getElementById('customIngredientName');
    const descriptionInput = document.getElementById('customIngredientDescription');

    const customName = nameInput.value.trim();
    const customDescription = descriptionInput.value.trim();

    if (customName.length < 2) {
        // Предполагается, что функция showNotification существует в глобальной области видимости
        showNotification('Название ингредиента должно быть длиннее', 'warning');
        return;
    }

    // Предполагается, что 'selectedIngredients' доступен в глобальной области видимости
    const alreadyExists = selectedIngredients.some(ing => ing.name.toLowerCase() === customName.toLowerCase());
    if (alreadyExists) {
        showNotification('Этот ингредиент уже в корзине', 'info');
        return;
    }

    const newIngredient = {
        id: 'custom_' + customName.toLowerCase().replace(/\s+/g, '_'),
        name: customName,
        description: customDescription,
        emoji: '📝',
        category: 'custom',
        units: ['шт', 'г', 'кг', 'мл', 'л'],
        quantity: 1,
        unit: 'шт'
    };

    // Эти переменные и функции должны быть доступны глобально
    selectedIngredients.push(newIngredient);
    updateSelectedIngredientsList();
    updateBadges();
    
    showNotification(`'${customName}' добавлен в корзину`, 'success');
    
    nameInput.value = '';
    descriptionInput.value = '';
    closeCustomIngredientModal();
    document.getElementById('searchInput').value = '';
}

// Слушатель событий можно добавить после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.querySelector('.add-ingredient-btn');
    if (openBtn) {
        openBtn.addEventListener('click', openCustomIngredientModal);
    }
    
    const closeBtn = document.querySelector('.modal-close-btn');
    if(closeBtn) {
        closeBtn.addEventListener('click', closeCustomIngredientModal);
    }

    const cancelBtn = document.querySelector('.modal-footer .secondary');
    if(cancelBtn) {
        cancelBtn.addEventListener('click', closeCustomIngredientModal);
    }
    
    const submitBtn = document.querySelector('.modal-footer .primary');
    if(submitBtn) {
        submitBtn.addEventListener('click', submitCustomIngredient);
    }

    // Закрытие модального окна по клику на оверлей
    const modalOverlay = document.getElementById('addCustomIngredientModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeCustomIngredientModal();
            }
        });
    }
}); 