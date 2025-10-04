let recipes = [];
let allRecipes = [];
let countries = {};
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const wheelContainer = document.querySelector('.wheel-container');
const recipeSection = document.getElementById('recipe-section');
const langToggle = document.getElementById('lang-toggle');
const mainTitle = document.getElementById('main-title');
const htmlTag = document.documentElement;
const cuisineFilter = document.getElementById('cuisine-filter');
const timeFilter = document.getElementById('time-filter');

const colors = ['#000000', '#FFFFFF'];
let currentLang = 'en';
let currentRotation = 0;
let isSpinning = false;

const foodEmojis = ['🍕', '🍔', '🍜', '🍱', '🍛', '🥘', '🍲', '🥗', '🍳', '🥙', '🌮', '🍝', '🥟', '🍢', '🍣'];

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'click') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'spin') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'win') {
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    }
}

const translations = {
    en: {
        title: 'What Should I Eat?',
        spin: 'SPIN!',
        cookingTime: 'Cooking Time',
        prepTime: 'Prep Time',
        servings: 'Servings',
        minutes: 'min',
        people: 'people',
        noInstructions: 'No instructions available'
    },
    fa: {
        title: 'امروز چی بخوریم؟',
        spin: 'بچرخان!',
        cookingTime: 'زمان پخت',
        prepTime: 'زمان آماده‌سازی',
        servings: 'تعداد',
        minutes: 'دقیقه',
        people: 'نفر',
        noInstructions: 'دستور پخت موجود نیست'
    }
};

// Load data
fetch('data/foods.json')
    .then(res => res.json())
    .then(data => {
        allRecipes = data.recipes;
        recipes = allRecipes;
        countries = data.countries.reduce((acc, c) => {
            acc[c.code] = c.name;
            return acc;
        }, {});

        // Populate cuisine filter
        const cuisines = [...new Set(data.countries.map(c => c.name))];
        cuisines.forEach(cuisine => {
            const option = document.createElement('option');
            option.value = cuisine;
            option.textContent = cuisine;
            cuisineFilter.appendChild(option);
        });

        drawWheel();
    });

function filterRecipes() {
    const cuisine = cuisineFilter.value;
    const time = timeFilter.value;

    recipes = allRecipes.filter(recipe => {
        const cuisineMatch = cuisine === 'all' || countries[recipe.country] === cuisine;

        let timeMatch = true;
        const totalTime = (recipe.cookingTime || 0) + (recipe.prepareTime || 0);
        if (time === 'quick') timeMatch = totalTime < 30;
        else if (time === 'medium') timeMatch = totalTime >= 30 && totalTime <= 60;
        else if (time === 'long') timeMatch = totalTime > 60;

        return cuisineMatch && timeMatch;
    });

    if (recipes.length === 0) {
        recipes = allRecipes; // Reset if no matches
    }

    drawWheel();
}

function getDifficulty(recipe) {
    const totalTime = (recipe.cookingTime || 0) + (recipe.prepareTime || 0);
    if (totalTime < 30) return 1;
    if (totalTime < 60) return 2;
    return 3;
}

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / 8;

    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i % 2];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = colors[i % 2] === '#000000' ? '#FFD700' : '#000000';
        ctx.font = 'bold 18px Arial';

        if (recipes[i]) {
            ctx.fillText(recipes[i].name.substring(0, 18), 150, 10);
        }
        ctx.restore();
    }
}

function spin() {
    if (isSpinning) return;

    playSound('spin');
    isSpinning = true;
    spinBtn.disabled = true;

    const spinRotation = 360 * 8 + Math.random() * 360;
    const duration = 4000;
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easeOutCubic for casino-like spin
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        currentRotation = spinRotation * easeProgress;

        ctx.clearRect(0, 0, 500, 500);
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate((currentRotation * Math.PI) / 180);
        ctx.translate(-250, -250);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            playSound('win');
            document.querySelector('.indicator').classList.add('glow');
            setTimeout(() => {
                document.querySelector('.indicator').classList.remove('glow');
            }, 500);
            isSpinning = false;
            spinBtn.disabled = false;
            showResult();
        }
    }

    requestAnimationFrame(animate);
}

function showResult() {
    const normalizedRotation = currentRotation % 360;
    const sliceAngle = 360 / 8;
    // Indicator points to the right (east/0 degrees)
    // Calculate which slice is at the indicator position
    const indicatorAngle = 0; // Right side
    const adjustedAngle = (360 - normalizedRotation + indicatorAngle) % 360;
    const selectedIndex = Math.floor(adjustedAngle / sliceAngle) % 8;
    const recipe = recipes[selectedIndex];

    if (recipe) {
        const t = translations[currentLang];
        const difficulty = getDifficulty(recipe);
        const emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

        // Recipe image with emoji
        document.getElementById('recipe-image').textContent = emoji;

        // Difficulty stars
        const difficultyHTML = '⭐'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
        document.getElementById('difficulty').innerHTML = `<span>${difficultyHTML}</span>`;

        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-country').textContent = countries[recipe.country] || recipe.country;

        document.getElementById('recipe-details').innerHTML = `
            ${recipe.description ? `<p>${recipe.description}</p>` : ''}
            ${recipe.cookingTime ? `<p>⏱️ ${t.cookingTime}: ${recipe.cookingTime} ${t.minutes}</p>` : ''}
            ${recipe.prepareTime ? `<p>⏱️ ${t.prepTime}: ${recipe.prepareTime} ${t.minutes}</p>` : ''}
            ${recipe.servingSize ? `<p>👥 ${t.servings}: ${recipe.servingSize} ${t.people}</p>` : ''}
        `;

        document.getElementById('recipe-instructions').textContent = recipe.instructions || t.noInstructions;
        recipeSection.classList.add('active');
    }
}

function switchLanguage() {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    const t = translations[currentLang];

    mainTitle.textContent = t.title;
    spinBtn.textContent = t.spin;
    langToggle.textContent = currentLang === 'en' ? 'فا' : 'En';

    htmlTag.lang = currentLang;
    htmlTag.dir = currentLang === 'fa' ? 'rtl' : 'ltr';

    if (recipeSection.classList.contains('active')) {
        showResult();
    }
}

langToggle.addEventListener('click', () => {
    playSound('click');
    switchLanguage();
});

spinBtn.addEventListener('click', () => {
    playSound('click');
    spin();
});

wheelContainer.addEventListener('click', (e) => {
    if (e.target === wheelContainer || e.target === canvas) {
        playSound('click');
        spin();
    }
});

cuisineFilter.addEventListener('change', () => {
    playSound('click');
    filterRecipes();
});

timeFilter.addEventListener('change', () => {
    playSound('click');
    filterRecipes();
});
