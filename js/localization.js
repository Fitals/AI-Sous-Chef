// Файл: js/localization.js

// Объект для хранения загруженных переводов
const translations = {};

// Функция для установки языка
async function setLanguage(lang) {
    // Сохраняем выбранный язык
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Загружаем файл перевода, если он еще не загружен
    if (!translations[lang]) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            translations[lang] = await response.json();
        } catch (error) {
            console.error('Error loading translation file:', error);
            // Возвращаемся к русскому языку по умолчанию в случае ошибки
            if (lang !== 'ru') {
                setLanguage('ru');
            }
            return;
        }
    }

    // Применяем переводы ко всем элементам с атрибутом data-i18n-key
    applyTranslations(lang);

    // Обновляем UI переключателя языка
    updateLanguageSwitcherUI(lang);
}

// Новая функция для применения переводов
function applyTranslations(lang) {
    const languagePack = translations[lang];
    if (!languagePack) {
        console.warn(`Language pack for ${lang} not loaded.`);
        return;
    }

    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        const translation = languagePack[key];
        if (translation) {
            applyTranslation(element, translation);
        } else {
            console.warn(`No translation found for key: ${key} in ${lang}`);
        }
    });
}

// Новая функция для применения перевода к ОДНОМУ элементу
function applyTranslation(element, translation) {
    // Обрабатываем разные типы элементов
    if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
        element.placeholder = translation;
    } else if (element.tagName === 'TITLE') {
        element.textContent = translation;
    } else {
        // Для большинства элементов просто меняем innerHTML
        element.innerHTML = translation;
    }
}

// Функция для обновления UI переключателя языка
function updateLanguageSwitcherUI(currentLang) {
    const langButtons = document.querySelectorAll('.language-option');
    langButtons.forEach(button => {
        if (button.dataset.lang === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Функция для получения текущего языка
function getLanguage() {
    // 1. Проверяем localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        return savedLang;
    }

    // 2. Проверяем язык браузера
    const browserLang = navigator.language.split('-')[0];
    if (['ru', 'en'].includes(browserLang)) {
        return browserLang;
    }

    // 3. Язык по умолчанию
    return 'ru';
}

// Новая функция для получения конкретного перевода
function getTranslation(key) {
    const lang = getLanguage();
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    console.warn(`Translation not found for key: ${key} in ${lang}`);
    // Возвращаем ключ в качестве запасного варианта, чтобы избежать ошибок
    return key;
}

// Инициализация локализации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getLanguage();
    setLanguage(initialLang);
}); 