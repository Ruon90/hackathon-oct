const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const grid = 32;

//colour map
const colorMap = {
    R: "#ff007f",
    G: "#33ff33",
    B: "#3399ff",
    Y: "#fff44f",
};

// Extract color keys and values
const colorKeys = Object.keys(colorMap);
const colors = Object.values(colorMap);

// Function to draw a glowing orb
function drawOrbGlowing(ctx, x, y, r, color, glowAlpha = 0.6) {
    // Outer glow
    const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.8);
    glow.addColorStop(0, `${color}`);
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Orb body
    const g = ctx.createRadialGradient(
        x - r * 0.22,
        y - r * 0.28,
        r * 0.06,
        x,
        y,
        r
    );
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.18, color);
    g.addColorStop(1, "rgba(0,0,0,0.18)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.ellipse(
        x - r * 0.3,
        y - r * 0.4,
        r * 0.3,
        r * 0.13,
        -0.45,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Function to generate a random grid of orbs
function generateRandomGrid(rows, cols, activeRows = 5) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        const rowData = [];
        const maxCols = row % 2 === 0 ? cols : cols - 1;

        for (let col = 0; col < maxCols; col++) {
            if (row < activeRows) {
                const randomCode =
                    colorKeys[Math.floor(Math.random() * colorKeys.length)];
                rowData.push(randomCode);
            } else {
                rowData.push(null); // empty cell
            }
        }

        grid.push(rowData);
    }
    return grid;
}

// Game state variables
let score = 0;
let level = 1;

// score and level display update functions
function updateScoreDisplay() {
    const scoreElement = document.getElementById("scoreDisplay");
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}
function updateLevelDisplay() {
    const el = document.getElementById("levelDisplay");
    if (el) el.textContent = level;
}
function nextLevel() {
    level++;
    levelGrid = generateRandomGrid(10, 8, 5); // or adjust rows/cols/activeRows as desired
    updateLevelDisplay();
    rebuildorbsFromGrid();
    getNewOrbs();
}

// Function to rebuild orbs from the level grid
function rebuildorbsFromGrid() {
    orbs.length = 0; // clear existing orb objects
    particles.length = 0; // clear particles to avoid leftover visuals

    const rows = levelGrid.length;
    for (let row = 0; row < rows; row++) {
        const maxCols = row % 2 === 0 ? 8 : 7;
        for (let col = 0; col < maxCols; col++) {
            const code = levelGrid[row]?.[col]; // "R","G","B","Y" or null
            const color = code ? colorMap[code] : null;
            createOrbs(col * grid, row * grid, color);

            // ensure the last pushed orb has correct row/col
            const b = orbs[orbs.length - 1];
            if (b) {
                b.row = row;
                b.col = col;
            }
        }
    }
}

// Initialize level grid
let levelGrid = generateRandomGrid(10, 8, 5); // 10 rows, 8 columns,top 5 filled
const orbGap = 1; // gap between orbs
const wallSize = 4;
let particles = [];

// Utility function to convert degrees to radians
function degToRad(deg) {
    return (deg * Math.PI) / 180;
}

// Utility function to rotate a point around the origin
function rotatePoint(x, y, angle) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos,
    };
}

// get a random integer between the range of [min,max]
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get the distance between two points
function getDistance(obj1, obj2) {
    const distX = obj1.x - obj2.x;
    const distY = obj1.y - obj2.y;
    return Math.sqrt(distX * distX + distY * distY);
}

//check between two orbs if they are colliding
function collides(obj1, obj2) {
    return getDistance(obj1, obj2) < obj1.radius + obj2.radius;
}

// get the closest orb to an object that is in a specific active state
function getClosestOrbs(obj, activeState = false) {
    const closestorbs = orbs.filter(
        (orb) => orb.active == activeState && collides(obj, orb)
    );

    if (!closestorbs.length) {
        return;
    }

    return (
        closestorbs
            // turn the array of orbs into an array of distances
            .map((orb) => {
                return {
                    distance: getDistance(obj, orb),
                    orb,
                };
            })
            .sort((a, b) => a.distance - b.distance)[0].orb
    );
}
function createOrbs(x, y, color) {
    const row = Math.floor(y / grid);
    const col = Math.floor(x / grid);

    // orbs on odd rows need to start half-way on the grid
    const startX = row % 2 === 0 ? 0 : 0.5 * grid;

    // because we are drawing circles we need the x/y position
    // to be the center of the circle instead of the top-left
    // corner like you would for a square
    const center = grid / 2;

    orbs.push({
        x: wallSize + (grid + bubbleGap) * col + startX + center,

        // the orbs are closer on the y axis so we subtract 4 on every
        // row
        y: wallSize + (grid + bubbleGap - 4) * row + center,

        radius: grid / 2,
        color: color,
        active: color ? true : false,
    });
}

// get neighboring orbs in the 6 possible directions
function getNeighbors(orb) {
    const neighbors = [];

    // check each of the 6 directions by "moving" the orb by a full
    // grid in each of the 6 directions (60 degree intervals)
    const dirs = [
        // right
        rotatePoint(grid, 0, 0),
        // up-right
        rotatePoint(grid, 0, degToRad(60)),
        // up-left
        rotatePoint(grid, 0, degToRad(120)),
        // left
        rotatePoint(grid, 0, degToRad(180)),
        // down-left
        rotatePoint(grid, 0, degToRad(240)),
        // down-right
        rotatePoint(grid, 0, degToRad(300)),
    ];

    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];

        const newOrbs = {
            x: orb.x + dir.x,
            y: orb.y + dir.y,
            radius: orb.radius,
        };
        const neighbor = getClosestOrbs(newOrbs, true);
        if (neighbor && neighbor !== orb && !neighbors.includes(neighbor)) {
            neighbors.push(neighbor);
        }
    }

    return neighbors;
}

// remove matching orbs recursively
function removeMatch(targetOrbs) {
    const matches = [targetOrbs];

    orbs.forEach((orb) => (orb.processed = false));
    targetOrbs.processed = true;

    // loop over the neighbors of matching colors for more matches
    let neighbors = getNeighbors(targetOrbs);
    for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (!neighbor.processed) {
            neighbor.processed = true;

            if (neighbor.color === targetOrbs.color) {
                matches.push(neighbor);
                neighbors = neighbors.concat(getNeighbors(neighbor));
            }
        }
    }

    if (matches.length >= 3) {
        popSound.currentTime = 0; // rewind to start
        popSound.play();

        matches.forEach((orb) => {
            orb.active = false;

            //  Clear the grid cell
            const row = orb.row;
            const col = orb.col;
            if (levelGrid[row]) {
                levelGrid[row][col] = null;
            }

            // Add score
            score += 1;
        });

        updateScoreDisplay();

        return true;
    }
}

// sound effects
const shootSound = new Audio("assets/sounds/blaster.mp3");
shootSound.volume = 0.6; // optional: adjust volume (0.0 to 1.0)
const popSound = new Audio("assets/sounds/pop.mp3");
popSound.volume = 0.8; //

// make any floating orbs (orbs that don't have a orb chain
// that touch the ceiling) drop down the screen
function dropFloatingorbs() {
    const activeorbs = orbs.filter((orb) => orb.active);
    activeorbs.forEach((orb) => (orb.processed = false));

    // start at the orbs that touch the ceiling
    let neighbors = activeorbs.filter((orb) => orb.y - grid <= wallSize);

    // process all orbs that form a chain with the ceiling orbs
    for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (!neighbor.processed) {
            neighbor.processed = true;
            neighbors = neighbors.concat(getNeighbors(neighbor));
        }
    }

    // any orb that is not processed doesn't touch the ceiling
    activeorbs
        .filter((orb) => !orb.processed)
        .forEach((orb) => {
            orb.active = false;
            // create a particle orb that falls down the screen
            particles.push({
                x: orb.x,
                y: orb.y,
                color: orb.color,
                radius: orb.radius,
                active: true,
            });
        });
}

// fill the grid with inactive orbs
for (let row = 0; row < 10; row++) {
    for (let col = 0; col < (row % 2 === 0 ? 8 : 7); col++) {
        // if the level has a orb at the location, create an active
        // orb rather than an inactive one

        const color = levelGrid[row]?.[col];
        createOrbs(col * grid, row * grid, colorMap[color]);
    }
}

// returns true when no active orbs remain
function boardIsCleared() {
    return !orbs.some((b) => b.active);
}
const curOrbsPos = {
    // place the current orb horizontally in the middle of the screen
    x: canvas.width / 2,
    y: canvas.height - grid * 1.5,
};

const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
const curOrbs = {
    x: curOrbsPos.x,
    y: curOrbsPos.y,
    color: colorMap[randomKey],
    radius: grid / 2, // a circles radius is half the width (diameter)

    // how fast the orb should go in either the x or y direction
    speed: 9,

    // orb velocity
    dx: 0,
    dy: 0,
};

const cannonImg = new Image();
cannonImg.src = "assets/al/images/cannon.png";
// adjust these values to match your sprite dimensions and pivot
const CANNON_WIDTH = 128;
const CANNON_HEIGHT = 192;
const CANNON_PIVOT_X = 67; // pivot pixel inside sprite (x)
const CANNON_PIVOT_Y = 25; // pivot pixel inside sprite (y)
const CANNON_WORLD_X = curOrbsPos.x;
const CANNON_WORLD_Y = curOrbsPos.y; // shift cannon below arrow

// muzzle offset in sprite-local coordinates (where the projectile should start)
// measured from sprite top-left. Tweak these to match muzzle tip.
const MUZZLE_SPRITE_X = 28; // x pixel in sprite
const MUZZLE_SPRITE_Y = 70; // y pixel in sprite

// angle (in radians) of the shooting arrow
let shootDeg = 0;

// min/max angle (in radians) of the shooting arrow
const minDeg = degToRad(-60);
const maxDeg = degToRad(60);

// the direction of movement for the arrow (-1 = left, 1 = right)
let shootDir = 0;
// reset the orb to shoot to the bottom of the screen
function getNewOrbs() {
    curOrbs.x = curOrbsPos.x;
    curOrbs.y = curOrbsPos.y;
    curOrbs.dx = curOrbs.dy = 0;

    // determine available colors based on active orbs
    const available = [];
    orbs.forEach((orb) => {
        if (orb.active && !available.includes(orb.color)) {
            available.push(orb.color);
        }
    });

    // pick a random colour from available set
    const randIndex = getRandomInt(0, available.length - 1);
    curOrbs.color = available[randIndex];
}

// handle collision between the current orb and another orb
function handleCollision(orb) {
    orb.color = curOrbs.color;
    orb.active = true;
    getNewOrbs();
    removeMatch(orb);
    dropFloatingorbs();
    if (boardIsCleared()) nextLevel();
}

// game loop
function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move the shooting arrow
    shootDeg = shootDeg + degToRad(2) * shootDir;

    // prevent shooting arrow from going below/above min/max
    if (shootDeg < minDeg) {
        shootDeg = minDeg;
    } else if (shootDeg > maxDeg) {
        shootDeg = maxDeg;
    }

    // move current orb by it's velocity
    curOrbs.x += curOrbs.dx;
    curOrbs.y += curOrbs.dy;

    // prevent orb from going through walls by changing its velocity
    if (curOrbs.x - grid / 2 < wallSize) {
        curOrbs.x = wallSize + grid / 2;
        curOrbs.dx *= -1;
    } else if (curOrbs.x + grid / 2 > canvas.width - wallSize) {
        curOrbs.x = canvas.width - wallSize - grid / 2;
        curOrbs.dx *= -1;
    }

    // check to see if orb collides with the top wall
    if (curOrbs.y - grid / 2 < wallSize) {
        // make the closest inactive orb active
        const closestOrbs = getClosestOrbs(curOrbs);
        handleCollision(closestOrbs);
    }

    // check to see if orb collides with another orb
    for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        if (orb.active && collides(curOrbs, orb)) {
            const closestOrbs = getClosestOrbs(curOrbs);
            if (!closestOrbs) {
                window.alert("Game Over");
                window.location.reload();
            }

            if (closestOrbs) {
                handleCollision(closestOrbs);
            }
        }
    }

    // move orb particles
    particles.forEach((particle) => {
        particle.y += 8;
    });

    // remove particles that went off the screen
    particles = particles.filter(
        (particles) => particles.y < canvas.height - grid / 2
    );

    // draw walls
    context.fillStyle = "#b5eaffff";
    context.fillRect(0, 0, canvas.width, wallSize);
    context.fillRect(0, 0, wallSize, canvas.height);
    context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

    // draw grid orbs as plain orbs
    orbs.forEach((b) => {
        if (!b.active) return;
        drawOrbGlowing(context, b.x, b.y, b.radius, b.color);
    });

    // draw particles cheaply (or use drawOrbPlain for more polish)
    particles.forEach((p) => {
        drawOrbGlowing(context, p.x, p.y, p.radius, p.color);
    });

    // draw fire arrow. since we're rotating the canvas we need to save
    // the state and restore it when we're done
    context.save();
    context.translate(CANNON_WORLD_X, CANNON_WORLD_Y);
    context.rotate(shootDeg);

    // draw cannon under the arrow
    context.drawImage(
        cannonImg,
        0,
        0,
        CANNON_WIDTH,
        CANNON_HEIGHT,
        -CANNON_PIVOT_X,
        -CANNON_PIVOT_Y,
        CANNON_WIDTH,
        CANNON_HEIGHT
    );
    context.translate(0, (-grid / 2) * 4.5);

    // draw arrow ↑
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, grid * 2);
    context.moveTo(0, 0);
    context.lineTo(-10, grid * 0.4);
    context.moveTo(0, 0);
    context.lineTo(10, grid * 0.4);
    context.stroke();

    context.restore();

    // draw current orb
    const previewOffset = grid * 0.2;
    const previewX = CANNON_WORLD_X + Math.sin(shootDeg) * previewOffset;
    const previewY = CANNON_WORLD_Y - Math.cos(shootDeg) * previewOffset;

    if ((curOrbs.dx || 0) === 0 && (curOrbs.dy || 0) === 0) {
        drawOrbGlowing(
            context,
            previewX,
            previewY,
            curOrbs.radius,
            curOrbs.color
        );
    } else {
        drawOrbGlowing(
            context,
            curOrbs.x,
            curOrbs.y,
            curOrbs.radius,
            curOrbs.color
        );
    }
}

// listen for keyboard events to move the fire arrow
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        shootDir = -1;
    } else if (e.code === "ArrowRight") {
        shootDir = 1;
    }

    // if the current orb is not moving we can launch it
    if (e.code === "Space" && curOrbs.dx === 0 && curOrbs.dy === 0) {
        // convert an angle to x/y
        curOrbs.dx = Math.sin(shootDeg) * curOrbs.speed;
        curOrbs.dy = -Math.cos(shootDeg) * curOrbs.speed;

        shootSound.currentTime = 0; // rewind to start
        shootSound.play();
    }
});

// listen for keyboard events to stop moving the fire arrow if key is
// released
document.addEventListener("keyup", (e) => {
    if (
        // only reset shoot dir if the released key is also the current
        // direction of movement. otherwise if you press down both arrow
        // keys at the same time and then release one of them, the arrow
        // stops moving even though you are still pressing a key
        (e.code === "ArrowLeft" && shootDir === -1) ||
        (e.code === "ArrowRight" && shootDir === 1)
    ) {
        shootDir = 0;
    }
});

// start the game
requestAnimationFrame(loop);
