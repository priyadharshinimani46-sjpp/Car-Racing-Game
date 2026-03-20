const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

let player = { speed: 5, score: 0 };
let keys = {};
let gameStarted = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Start Game
function startGame() {
    gameArea.innerHTML = "";
    player.score = 0;
    player.speed = 5;
    gameStarted = true;

    // Create player car
    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Road lines
    for (let i = 0; i < 5; i++) {
        let line = document.createElement("div");
        line.setAttribute("class", "roadLine");
        line.style.top = (i * 120) + "px";
        gameArea.appendChild(line);
    }

    // Enemy cars
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement("div");
        enemy.setAttribute("class", "enemy");
        enemy.style.top = (i * -150) + "px";
        enemy.style.left = Math.floor(Math.random() * 250) + "px";
        gameArea.appendChild(enemy);
    }

    window.requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop() {
    if (!gameStarted) return;

    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    moveLines();
    moveEnemies(car);

    // Move car
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < (road.width - 50)) player.x += player.speed;
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < (road.height - 100)) player.y += player.speed;

    car.style.left = player.x + "px";
    car.style.top = player.y + "px";

    player.score++;
    scoreDisplay.innerText = player.score;

    // Increase difficulty
    if (player.score % 200 === 0) {
        player.speed += 0.5;
    }

    window.requestAnimationFrame(gameLoop);
}

// Move road lines
function moveLines() {
    let lines = document.querySelectorAll(".roadLine");
    lines.forEach(line => {
        let y = parseInt(line.style.top);
        y += player.speed;
        if (y > 500) y -= 600;
        line.style.top = y + "px";
    });
}

// Move enemies
function moveEnemies(car) {
    let enemies = document.querySelectorAll(".enemy");

    enemies.forEach(enemy => {
        let y = parseInt(enemy.style.top);
        y += player.speed;
        enemy.style.top = y + "px";

        if (isCollide(car, enemy)) {
            alert("Game Over! Score: " + player.score);
            gameStarted = false;
        }

        if (y > 500) {
            enemy.style.top = "-150px";
            enemy.style.left = Math.floor(Math.random() * 250) + "px";
        }
    });
}

// Collision detection
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}
