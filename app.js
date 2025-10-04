let recipes = [];
let countries = {};
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const modal = document.getElementById('recipe-modal');
const closeBtn = document.querySelector('.close');

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

let currentRotation = 0;
let isSpinning = false;

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
        ctx.fillStyle = colors[i];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';

        if (recipes[i]) {
            ctx.fillText(recipes[i].name.substring(0, 20), 150, 10);
        }
        ctx.restore();
    }
}

function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const spinRotation = 360 * 5 + Math.random() * 360;
    const duration = 3000;
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        currentRotation = spinRotation * easeOut;

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
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-country').textContent = countries[recipe.country] || recipe.country;

        document.getElementById('recipe-details').innerHTML = `
            ${recipe.description ? `<p>${recipe.description}</p>` : ''}
            ${recipe.cookingTime ? `<p>⏱️ زمان پخت: ${recipe.cookingTime} دقیقه</p>` : ''}
            ${recipe.prepareTime ? `<p>⏱️ زمان آماده‌سازی: ${recipe.prepareTime} دقیقه</p>` : ''}
            ${recipe.servingSize ? `<p>👥 تعداد: ${recipe.servingSize} نفر</p>` : ''}
        `;

        document.getElementById('recipe-instructions').textContent = recipe.instructions || 'دستور پخت موجود نیست';
        modal.style.display = 'block';
    }
}

spinBtn.addEventListener('click', spin);
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
