export default class loadingScene extends Phaser.Scene {
    preload() {
        // Add the fill image first (or graphics object)
        this.load.image("barBg", "assets/tower/images/loadingbar.png");
        this.load.image("continueButton", "assets/tower/images/continue.png");
        // Load all assets
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
            this.add
                .image(300, 500, "continueButton")
                .setScale(0.25)
                .setInteractive()
                .on("pointerdown", () => {
                    this.scene.start("MenuScene");
                });
        }
    }
}
