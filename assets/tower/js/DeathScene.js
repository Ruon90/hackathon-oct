export default class DeathScene extends Phaser.Scene {
    constructor() {
        super("DeathScene");
    }

    init(data) {
        this.finalScore = data.score;
    }
    preload() {
        this.load.image("gameOver", "assets/tower/images/game-over.png");
        this.load.audio("deathBG", "assets/tower/audio/death_background.mp3");
        this.load.image(
            "enemyScanline",
            "assets/tower/images/enemy_static.png"
        ); // use your actual path
    }
    create() {
        // this.add.text(175, 250, "You Died", {
        //     fontSize: "32px",
        //     fill: "#f00",
        // });
        this.enemyOverlay = this.add
            .tileSprite(
                0,
                0,
                this.cameras.main.width,
                this.cameras.main.height,
                "enemyScanline"
            )
            .setOrigin(0, 0)
            .setAlpha(0.05) // low opacity for subtle effect
            .setDepth(-1);
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const gameOverImg = this.add
            .image(centerX, centerY - 180, "gameOver")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);

        this.add
            .text(centerX, centerY + 20, `Score: ${this.finalScore}`, {
                fontSize: "20px",
                fill: "#fff",
            })
            .setOrigin(0.5, 0.5);

        this.restartText = this.add
            .text(centerX, centerY + 180, "Press SPACE to Restart", {
                fontSize: "20px",
                fill: "#ccc",
            })
            .setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: this.restartText,
            alpha: { from: 1, to: 0.3 },
            duration: 300,
            yoyo: true,
            repeat: -1,
        });
        this.tweens.add({
            targets: gameOverImg,
            alpha: { from: 1, to: 0.3 },
            duration: 1555,
            yoyo: true,
            repeat: -1,
        });
        this._colorElapsed = 0;
        this._colorInterval = 200;
        this._colorIndex = 0;
        this._colorPalette = ["#ccc", "#ff0000"];

        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("GameScene");
            this.DeathMusic.stop();
        });

        this.DeathMusic = this.sound.add("deathBG", {
            loop: true,
            volume: 0.3,
        });
        this.DeathMusic.play();
        // const flickerOverlay = this.add
        //     .rectangle(
        //         0,
        //         0,
        //         this.cameras.main.width,
        //         this.cameras.main.height,
        //         0x000000
        //     )
        //     .setOrigin(0, 0)
        //     .setAlpha(0);

        // this.tweens.add({
        //     targets: flickerOverlay,
        //     alpha: { from: 0.3, to: 0 },
        //     duration: 100,
        //     yoyo: true,
        //     repeat: 5,
        //     onComplete: () => flickerOverlay.destroy(),
        // });
    }
    update(time, delta) {
        this._colorElapsed += delta;
        if (this._colorElapsed >= this._colorInterval) {
            this._colorElapsed -= this._colorInterval;
            this._colorIndex =
                (this._colorIndex + 1) % this._colorPalette.length;
            if (this.restartText && this.restartText.setStyle) {
                this.restartText.setStyle({
                    fill: this._colorPalette[this._colorIndex],
                });
            }
        }
        this.enemyOverlay.tilePositionY -= 0.5; // scroll upward slowly
    }
}
