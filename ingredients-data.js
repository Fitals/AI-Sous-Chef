// ingredients-data.js - База данных ингредиентов для CulinaryChat Pro
// Отдельный файл для удобства расширения списка ингредиентов

console.log('📚 Загружаем базу данных ингредиентов...');

// Экспортируем массив ингредиентов в глобальную область видимости
const availableIngredients = [
    // --- ОВОЩИ ---
    { emoji: '🍅', name: 'Помидоры', id: 'tomato', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🍒', name: 'Помидоры черри', id: 'cherry_tomato', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🥒', name: 'Огурцы', id: 'cucumber', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🧅', name: 'Лук репчатый', id: 'onion', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🧅', name: 'Красный лук', id: 'red_onion', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🧅', name: 'Зеленый лук', id: 'green_onion', category: 'vegetables', units: ['пучок', 'г'] },
    { emoji: '🥕', name: 'Морковь', id: 'carrot', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🥔', name: 'Картофель', id: 'potato', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🥦', name: 'Брокколи', id: 'broccoli', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🥬', name: 'Цветная капуста', id: 'cauliflower', category: 'vegetables', units: ['кочан', 'кг', 'г'] },
    { emoji: '🧄', name: 'Чеснок', id: 'garlic', category: 'vegetables', units: ['зубчик', 'головка', 'г'] },
    { emoji: '🌶️', name: 'Перец чили', id: 'chili', category: 'vegetables', units: ['шт', 'г'] },
    { emoji: '🫑', name: 'Болгарский перец', id: 'bell_pepper', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🥬', name: 'Салат Айсберг', id: 'lettuce_iceberg', category: 'vegetables', units: ['кочан', 'г'] },
    { emoji: '🥬', name: 'Салат Романо', id: 'lettuce_romaine', category: 'vegetables', units: ['кочан', 'г'] },
    { emoji: '🥬', name: 'Шпинат', id: 'spinach', category: 'vegetables', units: ['пучок', 'г'] },
    { emoji: '🍆', name: 'Баклажан', id: 'eggplant', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🥒', name: 'Кабачок', id: 'zucchini', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🎃', name: 'Тыква', id: 'pumpkin', category: 'vegetables', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🌽', name: 'Кукуруза', id: 'corn', category: 'vegetables', seasonal: true, units: ['початок', 'банка', 'г'] },
    { emoji: '🍄', name: 'Шампиньоны', id: 'mushrooms', category: 'vegetables', units: ['кг', 'г'] },
    { emoji: '🍄', name: 'Лесные грибы', id: 'forest_mushrooms', category: 'vegetables', seasonal: true, units: ['кг', 'г'] },
    { emoji: '🫛', name: 'Зеленый горошек', id: 'green_peas', category: 'vegetables', units: ['банка', 'г'] },
    { emoji: '🫛', name: 'Стручковая фасоль', id: 'green_beans', category: 'vegetables', units: ['кг', 'г'] },
    { emoji: '🫒', name: 'Оливки', id: 'olives', category: 'vegetables', units: ['банка', 'г'] },
    { emoji: '🫒', name: 'Маслины', id: 'black_olives', category: 'vegetables', units: ['банка', 'г'] },
    { emoji: '🥑', name: 'Авокадо', id: 'avocado', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🥬', name: 'Капуста', id: 'cabbage', category: 'vegetables', units: ['кочан', 'кг', 'г'] },
    { emoji: '🥬', name: 'Пекинская капуста', id: 'chinese_cabbage', category: 'vegetables', units: ['кочан', 'кг', 'г'] },
    { emoji: '🌿', name: 'Сельдерей', id: 'celery', category: 'vegetables', units: ['стебель', 'корень', 'г'] },
    { emoji: '🌿', name: 'Редис', id: 'radish', category: 'vegetables', seasonal: true, units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Свекла', id: 'beetroot', category: 'vegetables', units: ['шт', 'кг', 'г'] },
    { emoji: '🌿', name: 'Имбирь', id: 'ginger', category: 'vegetables', units: ['корень', 'г'] },
    { emoji: '🌿', name: 'Артишок', id: 'artichoke', category: 'vegetables', units: ['шт', 'г'] },
    { emoji: '🌿', name: 'Спаржа', id: 'asparagus', category: 'vegetables', seasonal: true, units: ['пучок', 'г'] },
    
    // --- ЗЕЛЕНЬ ---
    { emoji: '🌿', name: 'Петрушка', id: 'parsley', category: 'herbs', units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Укроп', id: 'dill', category: 'herbs', units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Базилик', id: 'basil', category: 'herbs', units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Кинза', id: 'coriander', category: 'herbs', units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Мята', id: 'mint', category: 'herbs', units: ['пучок', 'г'] },
    { emoji: '🌿', name: 'Розмарин', id: 'rosemary', category: 'herbs', units: ['ветка', 'г'] },
    { emoji: '🌿', name: 'Тимьян', id: 'thyme', category: 'herbs', units: ['ветка', 'г'] },
    { emoji: '🌿', name: 'Руккола', id: 'arugula', category: 'herbs', units: ['пучок', 'г'] },

    // --- МЯСО И ПТИЦА ---
    { emoji: '🥩', name: 'Говядина', id: 'beef', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🥩', name: 'Говяжий фарш', id: 'ground_beef', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🍖', name: 'Свинина', id: 'pork', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🍖', name: 'Свиной фарш', id: 'ground_pork', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🍗', name: 'Куриное филе', id: 'chicken_breast', category: 'meat', units: ['шт', 'кг', 'г'] },
    { emoji: '🍗', name: 'Куриные ножки', id: 'chicken_legs', category: 'meat', units: ['шт', 'кг', 'г'] },
    { emoji: '🍗', name: 'Куриные крылья', id: 'chicken_wings', category: 'meat', units: ['шт', 'кг', 'г'] },
    { emoji: '🍗', name: 'Куриный фарш', id: 'ground_chicken', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🦃', name: 'Индейка', id: 'turkey', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🐑', name: 'Баранина', id: 'lamb', category: 'meat', units: ['кг', 'г'] },
    { emoji: '🥓', name: 'Бекон', id: 'bacon', category: 'meat', units: ['упаковка', 'г'] },
    { emoji: '🌭', name: 'Сосиски', id: 'sausages', category: 'meat', units: ['шт', 'кг', 'г'] },
    { emoji: '🌭', name: 'Колбаса', id: 'salami', category: 'meat', units: ['палка', 'г'] },
    { emoji: '🦆', name: 'Утка', id: 'duck', category: 'meat', units: ['шт', 'кг', 'г'] },
    { emoji: '🐰', name: 'Кролик', id: 'rabbit', category: 'meat', units: ['шт', 'кг', 'г'] },

    // --- РЫБА И МОРЕПРОДУКТЫ ---
    { emoji: '🐟', name: 'Лосось', id: 'salmon', category: 'fish', units: ['кг', 'г', 'филе'] },
    { emoji: '🐟', name: 'Треска', id: 'cod', category: 'fish', units: ['кг', 'г', 'филе'] },
    { emoji: '🐟', name: 'Тунец (консервы)', id: 'canned_tuna', category: 'fish', units: ['банка', 'г'] },
    { emoji: '🐟', name: 'Сельдь', id: 'herring', category: 'fish', units: ['шт', 'банка', 'г'] },
    { emoji: '🐟', name: 'Скумбрия', id: 'mackerel', category: 'fish', units: ['шт', 'кг', 'г'] },
    { emoji: '🦐', name: 'Креветки', id: 'shrimp', category: 'fish', units: ['кг', 'г'] },
    { emoji: '🦑', name: 'Кальмары', id: 'squid', category: 'fish', units: ['кг', 'г'] },
    { emoji: '🦪', name: 'Мидии', id: 'mussels', category: 'fish', units: ['кг', 'г'] },
    { emoji: '🦀', name: 'Крабовые палочки', id: 'crab_sticks', category: 'fish', units: ['упаковка', 'г'] },
    { emoji: '🐟', name: 'Икра красная', id: 'red_caviar', category: 'fish', units: ['банка', 'г'] },

    // --- МОЛОЧНЫЕ ПРОДУКТЫ И ЯЙЦА ---
    { emoji: '🥛', name: 'Молоко', id: 'milk', category: 'dairy', units: ['л', 'мл'] },
    { emoji: '🥛', name: 'Сливки', id: 'cream', category: 'dairy', units: ['л', 'мл'] },
    { emoji: '🥛', name: 'Кефир', id: 'kefir', category: 'dairy', units: ['л', 'мл'] },
    { emoji: '🥣', name: 'Йогурт натуральный', id: 'yogurt', category: 'dairy', units: ['банка', 'г'] },
    { emoji: '🧈', name: 'Сливочное масло', id: 'butter', category: 'dairy', units: ['пачка', 'г'] },
    { emoji: '🧀', name: 'Сыр твердый', id: 'hard_cheese', category: 'dairy', units: ['кг', 'г'] },
    { emoji: '🧀', name: 'Пармезан', id: 'parmesan', category: 'dairy', units: ['кусок', 'г'] },
    { emoji: '🧀', name: 'Моцарелла', id: 'mozzarella', category: 'dairy', units: ['шарик', 'г'] },
    { emoji: '🧀', name: 'Фета', id: 'feta_cheese', category: 'dairy', units: ['упаковка', 'г'] },
    { emoji: '🧀', name: 'Творог', id: 'cottage_cheese', category: 'dairy', units: ['пачка', 'кг', 'г'] },
    { emoji: '🥣', name: 'Сметана', id: 'sour_cream', category: 'dairy', units: ['банка', 'г'] },
    { emoji: '🥚', name: 'Яйца куриные', id: 'eggs', category: 'dairy', units: ['шт', 'десяток'] },
    { emoji: '🥚', name: 'Яйца перепелиные', id: 'quail_eggs', category: 'dairy', units: ['шт', 'упаковка'] },

    // --- КРУПЫ, ЗЛАКИ И БОБОВЫЕ ---
    { emoji: '🍞', name: 'Хлеб', id: 'bread', category: 'grains', units: ['буханка', 'кусок', 'г'] },
    { emoji: '🥖', name: 'Багет', id: 'baguette', category: 'grains', units: ['шт'] },
    { emoji: '🥯', name: 'Лаваш', id: 'lavash', category: 'grains', units: ['лист', 'упаковка'] },
    { emoji: '🍝', name: 'Паста (макароны)', id: 'pasta', category: 'grains', units: ['пачка', 'г'] },
    { emoji: '🍚', name: 'Рис', id: 'rice', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Гречка', id: 'buckwheat', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Овсянка', id: 'oats', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Булгур', id: 'bulgur', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Киноа', id: 'quinoa', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Кускус', id: 'couscous', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🫘', name: 'Фасоль (консервы)', id: 'canned_beans', category: 'grains', units: ['банка', 'г'] },
    { emoji: '🫘', name: 'Чечевица', id: 'lentils', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🫘', name: 'Нут', id: 'chickpeas', category: 'grains', units: ['кг', 'г', 'стакан'] },
    { emoji: '🌾', name: 'Мука пшеничная', id: 'flour', category: 'grains', units: ['кг', 'г', 'стакан'] },

    // --- ФРУКТЫ И ЯГОДЫ ---
    { emoji: '🍎', name: 'Яблоки', id: 'apple', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍐', name: 'Груши', id: 'pear', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍌', name: 'Бананы', id: 'banana', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍊', name: 'Апельсины', id: 'orange', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍋', name: 'Лимоны', id: 'lemon', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍋', name: 'Лайм', id: 'lime', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍇', name: 'Виноград', id: 'grapes', category: 'fruits', seasonal: true, units: ['кг', 'г'] },
    { emoji: '🍓', name: 'Клубника', id: 'strawberry', category: 'fruits', seasonal: true, units: ['кг', 'г'] },
    { emoji: '🫐', name: 'Черника', id: 'blueberry', category: 'fruits', seasonal: true, units: ['кг', 'г'] },
    { emoji: '🍒', name: 'Вишня', id: 'cherry', category: 'fruits', seasonal: true, units: ['кг', 'г'] },
    { emoji: '🥝', name: 'Киви', id: 'kiwi', category: 'fruits', units: ['шт', 'кг', 'г'] },
    { emoji: '🍍', name: 'Ананас', id: 'pineapple', category: 'fruits', units: ['шт', 'г'] },
    { emoji: '🥥', name: 'Кокос', id: 'coconut', category: 'fruits', units: ['шт', 'г'] },
    { emoji: '🥭', name: 'Манго', id: 'mango', category: 'fruits', units: ['шт', 'г'] },
    { emoji: '🍑', name: 'Персик', id: 'peach', category: 'fruits', seasonal: true, units: ['шт', 'кг', 'г'] },
    { emoji: '🍉', name: 'Арбуз', id: 'watermelon', category: 'fruits', seasonal: true, units: ['шт', 'кг', 'г'] },
    
    // --- СПЕЦИИ, СОУСЫ И МАСЛА ---
    { emoji: '🧂', name: 'Соль', id: 'salt', category: 'spices', units: ['г', 'щепотка', 'ч.л.'] },
    { emoji: '🧂', name: 'Перец черный', id: 'black_pepper', category: 'spices', units: ['г', 'щепотка', 'ч.л.'] },
    { emoji: '🌶️', name: 'Паприка', id: 'paprika', category: 'spices', units: ['г', 'ч.л.'] },
    { emoji: '🌿', name: 'Куркума', id: 'turmeric', category: 'spices', units: ['г', 'ч.л.'] },
    { emoji: '🌿', name: 'Корица', id: 'cinnamon', category: 'spices', units: ['палочка', 'г', 'ч.л.'] },
    { emoji: '🌿', name: 'Орегано', id: 'oregano', category: 'spices', units: ['г', 'ч.л.'] },
    { emoji: '🌿', name: 'Лавровый лист', id: 'bay_leaf', category: 'spices', units: ['шт'] },
    { emoji: '🍯', name: 'Мед', id: 'honey', category: 'spices', units: ['кг', 'г', 'ст.л.'] },
    { emoji: '🫒', name: 'Оливковое масло', id: 'olive_oil', category: 'spices', units: ['л', 'мл', 'ст.л.'] },
    { emoji: '🌻', name: 'Подсолнечное масло', id: 'sunflower_oil', category: 'spices', units: ['л', 'мл', 'ст.л.'] },
    { emoji: '🥫', name: 'Томатная паста', id: 'tomato_paste', category: 'spices', units: ['банка', 'г', 'ст.л.'] },
    { emoji: '🥫', name: 'Соевый соус', id: 'soy_sauce', category: 'spices', units: ['мл', 'ст.л.'] },
    { emoji: '🥫', name: 'Горчица', id: 'mustard', category: 'spices', units: ['банка', 'г', 'ч.л.'] },
    { emoji: '🥫', name: 'Майонез', id: 'mayonnaise', category: 'spices', units: ['банка', 'г', 'ст.л.'] },
    { emoji: '🥫', name: 'Уксус', id: 'vinegar', category: 'spices', units: ['мл', 'ст.л.'] },
    
    // --- ОРЕХИ И СЕМЕНА ---
    { emoji: '🌰', name: 'Грецкие орехи', id: 'walnuts', category: 'nuts', units: ['г'] },
    { emoji: '🌰', name: 'Миндаль', id: 'almonds', category: 'nuts', units: ['г'] },
    { emoji: '🌰', name: 'Кешью', id: 'cashews', category: 'nuts', units: ['г'] },
    { emoji: '🌰', name: 'Кунжут', id: 'sesame_seeds', category: 'nuts', units: ['г', 'ч.л.'] },
    { emoji: '🌰', name: 'Семена подсолнечника', id: 'sunflower_seeds', category: 'nuts', units: ['г'] },

    // --- СЛАДКОЕ И ВЫПЕЧКА ---
    { emoji: '🍬', name: 'Сахар', id: 'sugar', category: 'sweets', units: ['кг', 'г', 'стакан'] },
    { emoji: '🍫', name: 'Шоколад', id: 'chocolate', category: 'sweets', units: ['плитка', 'г'] },
    { emoji: '🍫', name: 'Какао-порошок', id: 'cocoa_powder', category: 'sweets', units: ['г', 'ст.л.'] },
    { emoji: '🍰', name: 'Разрыхлитель', id: 'baking_powder', category: 'sweets', units: ['пакетик', 'г', 'ч.л.'] },
    { emoji: '🍰', name: 'Дрожжи', id: 'yeast', category: 'sweets', units: ['пакетик', 'г'] },
    { emoji: '🍰', name: 'Ванилин', id: 'vanillin', category: 'sweets', units: ['пакетик', 'г'] }
];

// Функция для получения названия категории
function getCategoryName(categoryId) {
    const categories = {
        'vegetables': 'Овощи',
        'herbs': 'Зелень',
        'meat': 'Мясо и птица',
        'fish': 'Рыба и морепродукты',
        'dairy': 'Молочные продукты и яйца',
        'grains': 'Крупы, злаки и бобовые',
        'fruits': 'Фрукты и ягоды',
        'spices': 'Специи, соусы и масла',
        'nuts': 'Орехи и семена',
        'sweets': 'Сладкое и выпечка'
    };
    return categories[categoryId] || categoryId;
}

console.log(`✅ База данных ингредиентов загружена (${availableIngredients.length} ингредиентов)`);

// Помещаем объекты в глобальный scope (window)
window.availableIngredients = availableIngredients;
window.getCategoryName = getCategoryName; 