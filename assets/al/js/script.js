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
