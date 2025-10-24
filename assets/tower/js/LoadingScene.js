export default class loadingScene extends Phaser.Scene {
    preload() {
        this.load.image("barBg", "assets/tower/images/loadingbar.png");
        this.load.image("continueButton", "assets/tower/images/continue.png");
        this.load.spritesheet(
            "player",
            "assets/tower/images/tsprite_shoot2.png",
            {
                frameWidth: 322,
                frameHeight: 450,
            }
        );
        this.load.image("bullet", "assets/tower/images/bullet_static.png");
        // this.load.image("enemy", "assets/tower/images/enemy_static.png");
        this.load.image("background", "assets/tower/images/level.jpg");
        this.load.spritesheet(
            "playerWalk",
            "assets/tower/images/playerWalk.png",
            {
                frameWidth: 322, // adjust to your sprite frame width
                frameHeight: 450, // adjust to your sprite frame height
            }
        );

        this.load.spritesheet(
            "enemy_walk",
            "assets/tower/images/enemy_walk.png",
            {
                frameWidth: 403, // adjust to your sprite frame width
                frameHeight: 379, // adjust to your sprite frame height
            }
        );
        this.load.spritesheet(
            "wall_impact",
            "assets/tower/images/wall_impact.png",
            {
                frameWidth: 349, // adjust to your sprite frame width
                frameHeight: 292, // adjust to your sprite frame height
            }
        );
        this.load.spritesheet(
            "enemy_impact",
            "assets/tower/images/enemy_impact.png",
            {
                frameWidth: 321, // adjust to your sprite frame width
                frameHeight: 240, // adjust to your sprite frame height
            }
        );
        this.load.audio("gameMusic", "assets/tower/audio/game_music.mp3");
        this.load.audio("gunshot", "assets/tower/audio/gunshot.mp3");
        this.load.audio("enemyDestroy", "assets/tower/audio/enemy_destroy.mp3");
        this.load.audio("bulletHit", "assets/tower/audio/bullethit.mp3");
    }

    create() {
        const barBg = this.add
            .image(300, 300, "barBg")
            .setOrigin(0.5)
            .setScale(0.5);

        this.tweens.add({
            targets: barBg,
            alpha: { from: 1, to: 0.6 },
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
        this.load.on("complete", () => {
            this.scene.start("MenuScene");
        });
    }
    update() {
        if (this.load.totalComplete === this.load.totalToLoad) {
            const continueButton = this.add
                .image(290, 450, "continueButton")
                .setOrigin(0.5)
                .setScale(0.35)
                .setInteractive({ useHandCursor: true });
            continueButton.on("pointerdown", () => {
                this.scene.start("MenuScene");
            });
        }
    }
}
