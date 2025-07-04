const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const shareButton = document.getElementById('share-button');
const finalScoreSpan = document.getElementById('final-score');

const player = {
    x: canvas.width / 2 - 10,
    y: canvas.height - 60,
    width: 20,
    height: 20,
    color: '#0ff',
    dx: 0
};

let asteroids = [];
let score = 0;
let gameOver = false;
let gameRunning = false;
let scoreInterval;

function createAsteroid() {
    asteroids.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: Math.random() * 15 + 10, // size between 10 and 25
        speed: Math.random() * 2 + 1, // speed between 1 and 3
        color: '#f0f'
    });
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function moveAsteroids() {
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
        }
    });
}

function detectCollisions() {
    asteroids.forEach(asteroid => {
        if (
            player.x < asteroid.x + asteroid.size &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.size &&
            player.y + player.height > asteroid.y
        ) {
            endGame();
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.fillStyle = asteroid.color;
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.size, asteroid.size);
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText(`Score: ${score}`, 10, 25);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (!gameRunning) return;

    clearCanvas();
    drawPlayer();
    drawAsteroids();
    drawScore();

    movePlayer();
    moveAsteroids();
    detectCollisions();

    requestAnimationFrame(update);
}

function startGame() {
    gameRunning = true;
    gameOver = false;
    score = 0;
    player.x = canvas.width / 2 - 10;
    asteroids = [];
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // Increase score every second
    scoreInterval = setInterval(() => {
        if(gameRunning) score++;
    }, 100);

    // Create asteroids periodically
    setInterval(() => {
        if(gameRunning) createAsteroid();
    }, 600);
    
    update();
}

function endGame() {
    gameRunning = false;
    clearInterval(scoreInterval);
    finalScoreSpan.textContent = score;
    gameOverScreen.style.display = 'flex';
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

shareButton.addEventListener('click', () => {
    const text = `Mi puntaje en ${score} in #salva_al_gato! Puedes mejorarlo?`;
    const gameUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gameUrl)}`;
    window.open(twitterUrl, '_blank');
});

// Controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -5;
    if (e.key === 'ArrowRight' || e.key === 'd') player.dx = 5;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') player.dx = 0;
});

// Touch controls
canvas.addEventListener('touchstart', e => {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        player.dx = -5;
    } else {
        player.dx = 5;
    }
});

canvas.addEventListener('touchend', () => {
    player.dx = 0;
});