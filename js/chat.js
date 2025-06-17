document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.getElementById('messagesContainer');
    const cookingIndicator = document.getElementById('cookingIndicator');

    // Отправка сообщения по клику на кнопку
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Отправка сообщения по нажатию Enter
    if (messageInput) {
        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    /**
     * Отправляет сообщение пользователя и обрабатывает ответ
     */
    async function sendMessage() {
        const messageText = messageInput.value.trim();

        if (messageText === '') {
            return;
        }

        // Отображаем сообщение пользователя
        displayMessage({ type: 'user', text: messageText });

        // Очищаем поле ввода
        messageInput.value = '';

        // Показываем индикатор "готовки"
        showCookingIndicator();

        // Имитация ответа от ИИ
        setTimeout(() => {
            const botResponse = generateBotResponse(messageText);
            displayMessage({ type: 'bot', text: botResponse });
            hideCookingIndicator();
        }, 1500 + Math.random() * 1000);
    }

    /**
     * Отображает сообщение в окне чата
     * @param {{type: 'user' | 'bot', text: string}} message - Объект сообщения
     */
    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.type);

        const iconClass = message.type === 'user' ? 'fa-user' : 'fa-robot';

        // Безопасное отображение текста
        const textElement = document.createElement('div');
        textElement.className = 'message-text';
        textElement.textContent = message.text;


        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
            </div>
        `;
        
        // Вставляем текстовый узел после иконки
        messageElement.querySelector('.message-content').appendChild(textElement);


        messagesContainer.appendChild(messageElement);

        // Плавный скролл вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Плавное появление сообщения
        setTimeout(() => messageElement.classList.add('visible'), 10);
    }
    
    /**
     * Показывает индикатор загрузки
     */
    function showCookingIndicator() {
        if (cookingIndicator) {
            cookingIndicator.style.display = 'flex';
        }
    }

    /**
     * Скрывает индикатор загрузки
     */
    function hideCookingIndicator() {
        if (cookingIndicator) {
            cookingIndicator.style.display = 'none';
        }
    }

    /**
     * Генерирует простой ответ от бота
     * @param {string} userInput - Текст пользователя
     * @returns {string} - Ответ бота
     */
    function generateBotResponse(userInput) {
        const responses = [
            "Интересный вопрос! Дайте-ка подумать...",
            "Хм, я как раз знаю отличный рецепт на эту тему.",
            "Отличная идея! Сейчас что-нибудь придумаю.",
            "Я понял ваш запрос. Ищу лучшие варианты...",
            "С удовольствием помогу! Минуточку..."
        ];
        
        if (userInput.toLowerCase().includes("привет")) {
            return "Здравствуйте! Чем могу быть полезен на кухне сегодня?";
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }
}); 