export default class loadingScene extends Phaser.Scene {
    preload() {
        // Add the fill image first (or graphics object)
        this.load.image("barBg", "assets/tower/images/loadingbar.png");
        this.load.image("barFill", "assets/tower/images/loadingbarfill.png");

        this.barFill = this.add
            .image(300, 450, "barFill")
            .setOrigin(0.5)
            .setCrop(0, 0, 0, 20);

        // Track loading progress
        this.load.on("progress", (value) => {
            const fullWidth = this.barFill.width;
            this.barFill.setCrop(0, 0, fullWidth * value, this.barFill.height);
        });

        // Load all assets
    }

    create() {
        const barBg = this.add.image(300, 450, "barBg").setOrigin(0.5);
        this.barFill.setDepth(2); // ensure it's above the background

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
        // if (this.load.totalComplete === this.load.totalToLoad) {
        //     this.scene.start("MenuScene");
        // }
    }
}
