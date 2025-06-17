document.addEventListener('DOMContentLoaded', () => {
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    const deleteApiKeyBtn = document.getElementById('deleteApiKeyBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyStatus = document.getElementById('apiKeyStatus');

    // Функция для обновления статуса API ключа
    function updateApiKeyStatus() {
        const storedKey = localStorage.getItem('geminiApiKey');
        if (storedKey) {
            apiKeyInput.value = '';
            apiKeyInput.placeholder = '•••••••••••••••••••••••••';
            apiKeyStatus.textContent = 'API-ключ сохранен. Вы можете ввести новый, чтобы его обновить.';
            apiKeyStatus.className = 'success';
            deleteApiKeyBtn.style.display = 'inline-flex';
        } else {
            apiKeyInput.placeholder = 'Введите ваш API-ключ';
            apiKeyStatus.textContent = 'API-ключ не найден. Введите его, чтобы использовать все функции ИИ.';
            apiKeyStatus.className = 'error';
            deleteApiKeyBtn.style.display = 'none';
        }
    }

    // Обработчик кнопки "Применить"
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', () => {
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                localStorage.setItem('geminiApiKey', apiKey);
                updateApiKeyStatus();
                apiKeyStatus.textContent = 'Ключ успешно сохранен и применен!';
                setTimeout(updateApiKeyStatus, 3000);

            } else {
                 const storedKey = localStorage.getItem('geminiApiKey');
                if (!storedKey) {
                    apiKeyStatus.textContent = 'Пожалуйста, введите корректный API-ключ.';
                    apiKeyStatus.className = 'error';
                } else {
                    // Если поле пустое, но ключ уже сохранен, считаем это "отменой" ввода
                    apiKeyStatus.textContent = 'Ввод отменен. Действует предыдущий сохраненный ключ.';
                    apiKeyStatus.className = 'success';
                    setTimeout(updateApiKeyStatus, 3000);
                }
            }
        });
    }

    // Обработчик кнопки "Удалить"
    if (deleteApiKeyBtn) {
        deleteApiKeyBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить API-ключ?')) {
                localStorage.removeItem('geminiApiKey');
                updateApiKeyStatus();
                apiKeyStatus.textContent = 'API-ключ был успешно удален.';
                 setTimeout(updateApiKeyStatus, 3000);
            }
        });
    }


    // Инициализация статуса при загрузке страницы
    updateApiKeyStatus();
}); 