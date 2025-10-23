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
