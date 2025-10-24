let isGameRunning = false;
let gameLoopId = null;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let level = 1;
let maxLevel = 4;
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        trafficSound.play();
        gameLoopId = requestAnimationFrame(gameLoop);
        document.getElementById("startOverlay").style.display = "none";
        document.getElementById("pauseOverlay").style.display = "none";
    }
}
function pauseGame() {
    if (isGameRunning) {
        isGameRunning = false;
        trafficSound.pause();
        cancelAnimationFrame(gameLoopId);
        document.getElementById("pauseOverlay").style.display = "block";
    }
}

const frog = {
    x: 180,
    y: 460,
    width: 40,
    height: 40,
    color: "lime",
};

const cars = [];
const frogImg = new Image();
frogImg.src = "assets/froggy/frog.png";

const carImg = new Image();
carImg.src = "assets/froggy/car.png";

function generateCars(level) {
    cars.length = 0;
    const lanes = [100, 160, 220, 280];

    function isTooClose(newCar, existingCars) {
        return existingCars.some(
            (car) =>
                newCar.x < car.x + car.width + 10 &&
                newCar.x + newCar.width + 10 > car.x
        );
    }

    for (let i = 0; i < lanes.length; i++) {
        const carsPerLane = level;
        for (let j = 0; j < carsPerLane; j++) {
            let newCar;
            do {
                newCar = {
                    x: Math.random() * (canvas.width - 60),
                    y: lanes[i],
                    width: 60,
                    height: 40,
                    speed: 2 + Math.random() * level,
                    color: "red",
                };
            } while (
                isTooClose(
                    newCar,
                    cars.filter((c) => c.y === lanes[i])
                )
            );

            cars.push(newCar);
        }
    }
}

generateCars(level);

function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frogImg, frog.x, frog.y, frog.width, frog.height);
    cars.forEach((car) => {
        ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
    });
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Level ${level}`, 10, 30);
}

// function update() {
//     cars.forEach((car) => {
//         car.x += car.speed;
//         if (car.x > canvas.width) car.x = -car.width;
//         if (isColliding(frog, car)) {
//             frog.y = 460;
//         }
//     });

//     if (frog.y < 40) {
//         if (level < maxLevel) {
//             level++;
//             alert(`Level ${level}!`);
//             frog.y = 460;
//             generateCars(level);
//         } else {
//             alert("You win the game!");
//             level = 1;
//             frog.y = 460;
//             generateCars(level);
//         }
//     }
// }
function update() {
    cars.forEach((car) => {
        car.x += car.speed;
        if (car.x > canvas.width) car.x = -car.width;
        if (isColliding(frog, car)) {
            frog.y = 460;
        }
    });

    if (frog.y < 40) {
        hopSound.currentTime = 0;
        hopSound.play();

        trafficSound.pause();
        trafficSound.currentTime = 0;

        if (level < maxLevel) {
            levelUpSound.currentTime = 0;
            levelUpSound.play();
            level++;
            alert(`Level ${level}!`);
            frog.y = 460;
            generateCars(level);
            trafficSound.play(); // restart traffic for next level
        } else {
            winSound.play();
            document.getElementById("winOverlay").style.display = "block";
            level = 1;
            frog.y = 460;
            generateCars(level);
            trafficSound.play(); // restart traffic for new game
        }
    }
}
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// document.addEventListener("keydown", (e) => {
//     const step = 20;
//     if (e.key === "ArrowUp") frog.y -= step;
//     if (e.key === "ArrowDown") frog.y += step;
//     if (e.key === "ArrowLeft") frog.x -= step;
//     if (e.key === "ArrowRight") frog.x += step;
// });

document.addEventListener("keydown", (e) => {
    const step = 20;
    let moved = false;

    if (e.key === "ArrowUp") {
        frog.y -= step;
        moved = true;
    }
    if (e.key === "ArrowDown") {
        frog.y += step;
        moved = true;
    }
    if (e.key === "ArrowLeft") {
        frog.x -= step;
        moved = true;
    }
    if (e.key === "ArrowRight") {
        frog.x += step;
        moved = true;
    }

    if (moved) {
        hopSound.currentTime = 0; // rewind to start
        hopSound.play();
    }
    if (e.key === "Enter" || e.code === "Space") {
        if (isGameRunning) {
            pauseGame();
        } else {
            startGame();
        }
    }
});

function gameLoop() {
    if (!isGameRunning) return;
    update();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}
const hopSound = new Audio("assets/froggy/hop.wav");
const trafficSound = new Audio("assets/froggy/traffic.wav");
const winSound = new Audio("assets/froggy/win.wav");
const levelUpSound = new Audio("assets/froggy/levelup.wav");
trafficSound.loop = true;

trafficSound.volume = 0.5;

// Start game manually (e.g. with Enter key or button)
document.getElementById("playAgainBtn").addEventListener("click", () => {
    document.getElementById("winOverlay").style.display = "none";
    level = 1;
    frog.y = 460;
    generateCars(level);
    startGame();
});
document.getElementById("btn-up").addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveFroggy("up");
});

document.getElementById("btn-down").addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveFroggy("down");
});

document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveFroggy("left");
});

document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveFroggy("right");
});

document.getElementById("btn-pause").addEventListener("touchstart", (e) => {
    e.preventDefault();
    togglePause();
});

function moveFroggy(direction) {
    const step = 20;
    let moved = false;

    if (direction === "up") {
        frog.y -= step;
        moved = true;
    }
    if (direction === "down") {
        frog.y += step;
        moved = true;
    }
    if (direction === "left") {
        frog.x -= step;
        moved = true;
    }
    if (direction === "right") {
        frog.x += step;
        moved = true;
    }

    if (moved) {
        hopSound.currentTime = 0;
        hopSound.play();
    }
}

function togglePause() {
    if (isGameRunning) {
        pauseGame();
    } else {
        startGame();
    }
}
