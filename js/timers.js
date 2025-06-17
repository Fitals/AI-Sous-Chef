// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ТАЙМЕРА =====
let timers = [];

// ===== ЭЛЕМЕНТЫ DOM ДЛЯ ТАЙМЕРА =====
const timersGrid = document.getElementById('timersGrid');
const emptyTimers = document.getElementById('emptyTimers');
const timersCountBadge = document.getElementById('timersCount');

// ===== ИНИЦИАЛИЗАЦИЯ ТАЙМЕРОВ =====
function initializeTimers() {
    loadTimers();
    setInterval(updateAllTimers, 1000);
    renderTimers();
    console.log('⏱️ Система таймеров инициализирована.');
}

// ===== ОСНОВНЫЕ ФУНКЦИИ УПРАВЛЕНИЯ ТАЙМЕРАМИ =====
function addTimer() {
    const name = prompt("Введите название таймера (например, 'Варка яиц'):", `Таймер #${timers.length + 1}`);
    if (!name) return;

    const time = prompt("Введите время в минутах:", "10");
    const minutes = parseInt(time, 10);
    if (isNaN(minutes) || minutes <= 0) {
        if (typeof showNotification === 'function') {
            showNotification("Пожалуйста, введите корректное время в минутах.", "error");
        } else {
            alert("Пожалуйста, введите корректное время в минутах.");
        }
        return;
    }

    const newTimer = {
        id: Date.now(),
        name: name,
        initialTime: minutes * 60,
        remainingTime: minutes * 60,
        isRunning: false,
        isPaused: false,
        startTime: 0
    };

    timers.push(newTimer);
    saveTimers();
    renderTimers();
}

function playPauseTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer || timer.remainingTime <= 0) return;

    if (timer.isRunning) {
        // Ставим на паузу
        timer.isRunning = false;
        timer.isPaused = true;
        const elapsedSinceStart = (Date.now() - timer.startTime) / 1000;
        timer.remainingTime -= elapsedSinceStart;
        if(timer.remainingTime < 0) timer.remainingTime = 0;
    } else {
        // Запускаем (или возобновляем)
        timer.isRunning = true;
        timer.isPaused = false;
        timer.startTime = Date.now();
    }
    
    saveTimers();
    renderTimer(timerId); // Немедленное обновление для отзывчивости
    updateBadges();
}

function resetTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (timer) {
        timer.isRunning = false;
        timer.isPaused = false;
        timer.remainingTime = timer.initialTime;
        saveTimers();
        renderTimer(timer.id);
        updateBadges();
    }
}

function deleteTimer(timerId) {
    if (confirm("Вы уверены, что хотите удалить этот таймер?")) {
        timers = timers.filter(t => t.id !== timerId);
        saveTimers();
        renderTimers();
    }
}

// ===== ФОНОВОЕ ОБНОВЛЕНИЕ И РЕНДЕРИНГ =====
function updateAllTimers() {
    let needsRender = false;
    timers.forEach(timer => {
        if (timer.isRunning && !timer.isPaused) {
            const elapsed = (Date.now() - timer.startTime) / 1000;
            const newRemainingTime = timer.initialTimeOnPlay - elapsed;

            if (newRemainingTime <= 0) {
                timer.remainingTime = 0;
                timer.isRunning = false;
                if (typeof showNotification === 'function') {
                    showNotification(`Таймер "${timer.name}" завершен!`, 'success');
                }
                // Можно добавить звук
                 try {
                    new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3').play();
                } catch(e) { console.error("Не удалось воспроизвести звук уведомления"); }
            } else {
                timer.remainingTime = newRemainingTime;
            }
            needsRender = true;
            renderTimer(timer.id);
        }
    });

    if(needsRender) {
        updateBadges();
        saveTimers();
    }
}

function renderTimers() {
    if (!timersGrid) return;

    if (timers.length === 0) {
        timersGrid.innerHTML = '';
        if(emptyTimers) emptyTimers.style.display = 'block';
    } else {
        if(emptyTimers) emptyTimers.style.display = 'none';
        timersGrid.innerHTML = '';
        timers.forEach(timer => {
            const timerCard = document.createElement('div');
            timerCard.className = 'timer-card';
            timerCard.setAttribute('data-timer-id', timer.id);
            timersGrid.appendChild(timerCard);
            renderTimer(timer.id);
        });
    }
    updateBadges();
}

function renderTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    const card = document.querySelector(`.timer-card[data-timer-id="${timer.id}"]`);
    if (!card) return;

    const isFinished = timer.remainingTime <= 0 && !timer.isRunning;

    card.classList.toggle('active', timer.isRunning);
    card.classList.toggle('paused', timer.isPaused);

    const minutes = Math.floor(timer.remainingTime / 60);
    const seconds = Math.floor(timer.remainingTime % 60);
    const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const playPauseIcon = timer.isRunning ? 'fa-pause' : 'fa-play';
    const playPauseClass = timer.isRunning ? '' : 'paused';

    card.innerHTML = `
        <div class="timer-card-header">
            <span class="timer-name">${timer.name}</span>
        </div>
        <div class="timer-display">${displayTime}</div>
        <div class="timer-info">
            Исходное время: ${Math.floor(timer.initialTime / 60)} мин.
        </div>
        <div class="timer-controls">
            <button class="timer-btn play-pause ${playPauseClass}" onclick="playPauseTimer(${timer.id})" ${isFinished ? 'disabled' : ''}>
                <i class="fas ${playPauseIcon}"></i>
            </button>
            <button class="timer-btn reset" onclick="resetTimer(${timer.id})">
                <i class="fas fa-undo"></i>
            </button>
            <button class="timer-btn delete" onclick="deleteTimer(${timer.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА =====
function saveTimers() {
    try {
        localStorage.setItem('culinaryChat_timers', JSON.stringify(timers));
    } catch (e) {
        console.error("Ошибка сохранения таймеров:", e);
    }
}

function loadTimers() {
    try {
        const savedTimers = localStorage.getItem('culinaryChat_timers');
        if (savedTimers) {
            timers = JSON.parse(savedTimers);
        }
    } catch (e) {
        console.error("Ошибка загрузки таймеров:", e);
        timers = [];
    }
}

// ===== ОБНОВЛЕНИЕ СЧЕТЧИКОВ =====
// Эта функция должна быть в основном файле скриптов, но мы её здесь дублируем
// на случай, если этот файл будет использоваться отдельно.
function updateBadges() {
    if (timersCountBadge) {
        const activeTimers = timers.filter(t => t.isRunning).length;
        timersCountBadge.textContent = activeTimers;
        timersCountBadge.style.display = activeTimers > 0 ? 'inline-block' : 'none';
    }
    // Здесь также должен быть код для обновления других счетчиков (ингредиенты, история)
}

// ===== ИНТЕГРАЦИЯ С ОСНОВНЫМ ПРИЛОЖЕНИЕМ =====
// 1. Добавьте <script src="js/timers.js"></script> в ваш index.html перед закрывающим тегом </body>
// 2. В основном файле скриптов (внутри index.html) найдите функцию initializeApp() и добавьте в нее вызов:
//    initializeTimers();
// 3. Найдите функцию switchSection(sectionName) и в блоке switch добавьте:
//    case 'timers':
//        renderTimers();
//        break;
// 4. В функции updateBadges() убедитесь, что обновляется счетчик таймеров (код уже есть в этой функции выше).

// Запускаем инициализацию, если основной скрипт уже загрузился
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimers);
} else {
    initializeTimers();
} 