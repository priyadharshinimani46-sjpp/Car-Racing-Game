const gameArea = document.getElementById("gameArea");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");

let player = {
    speed: 5,
    score: 0,
    lives: 3,
    level: 1,
    x: 125
};

let keys = {};
let running = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function startGame() {
    gameArea.innerHTML = "";
    player.score = 0;
    player.lives = 3;
    player.speed = 5;
    player.level = 1;
    running = true;

    updateHUD();

    // player car
    let car = document.createElement("div");
    car.classList.add("car");
    gameArea.appendChild(car);

    // road lines
    for (let i = 0; i < 5; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.style.top = (i * 120) + "px";
        gameArea.appendChild(line);
    }

    // enemies
    for (let i = 0; i < 3; i++) {
        createEnemy(i * -150);
    }

    requestAnimationFrame(gameLoop);
}

function pauseGame() {
    running = !running;
    if (running) requestAnimationFrame(gameLoop);
}

function restartGame() {
    startGame();
}

function createEnemy(topPos) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.top = topPos + "px";
    enemy.style.left = lanePosition();
    gameArea.appendChild(enemy);
}

function lanePosition() {
    const lanes = [0, 80, 160, 240];
    return lanes[Math.floor(Math.random() * lanes.length)] + "px";
}

function gameLoop() {
    if (!running) return;

    let car = document.querySelector(".car");

    moveLines();
    moveEnemies(car);

    // movement
    if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
    if (keys["ArrowRight"] && player.x < 250) player.x += 5;

    car.style.left = player.x + "px";

    player.score++;
    if (player.score % 500 === 0) {
        player.level++;
        player.speed += 1;
    }

    updateHUD();

    requestAnimationFrame(gameLoop);
}

function moveLines() {
    document.querySelectorAll(".line").forEach(line => {
        let y = parseInt(line.style.top);
        y += player.speed;
        if (y > 500) y -= 600;
        line.style.top = y + "px";
    });
}

function moveEnemies(car) {
    document.querySelectorAll(".enemy").forEach(enemy => {
        let y = parseInt(enemy.style.top);
        y += player.speed;
        enemy.style.top = y + "px";

        if (isCollide(car, enemy)) {
            player.lives--;
            enemy.style.top = "-150px";
            enemy.style.left = lanePosition();

            if (player.lives <= 0) {
                alert("Game Over! Score: " + player.score);
                running = false;
            }
        }

        if (y > 500) {
            enemy.style.top = "-150px";
            enemy.style.left = lanePosition();
        }
    });
}

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

function updateHUD() {
    scoreEl.innerText = player.score;
    livesEl.innerText = player.lives;
    levelEl.innerText = player.level;
}
