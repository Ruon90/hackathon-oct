import MenuScene from "./MenuScene.js";
import GameScene from "./GameScene.js";
import DeathScene from "./DeathScene.js";

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 900,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [MenuScene, GameScene, DeathScene],
};

const game = new Phaser.Game(config);
