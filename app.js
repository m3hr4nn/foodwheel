let recipes = [];
let countries = {};
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const wheelContainer = document.querySelector('.wheel-container');
const recipeSection = document.getElementById('recipe-section');
const langToggle = document.getElementById('lang-toggle');
const mainTitle = document.getElementById('main-title');
const htmlTag = document.documentElement;

const colors = ['#000000', '#FFFFFF'];
let currentLang = 'en';
let currentRotation = 0;
let isSpinning = false;

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
        recipes = data.recipes;
        countries = data.countries.reduce((acc, c) => {
            acc[c.code] = c.name;
            return acc;
        }, {});
        drawWheel();
    });

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
    const selectedIndex = Math.floor((360 - normalizedRotation + sliceAngle / 2) / sliceAngle) % 8;
    const recipe = recipes[selectedIndex];

    if (recipe) {
        const t = translations[currentLang];

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

langToggle.addEventListener('click', switchLanguage);
spinBtn.addEventListener('click', spin);
wheelContainer.addEventListener('click', (e) => {
    if (e.target === wheelContainer || e.target === canvas) {
        spin();
    }
});
