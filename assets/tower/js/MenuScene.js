export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }
    preload() {
        this.load.image(
            "menuBackground",
            "assets/tower/images/menu_background.png"
        );
        this.load.image("sky", "assets/tower/images/menu_sky.png");
        this.load.spritesheet("clouds", "assets/tower/images/clouds.png", {
            frameWidth: 512, // adjust to match actual frame width
            frameHeight: 512, // adjust to match actual frame height
        });
        this.load.spritesheet(
            "lightning",
            "assets/tower/images/lightning.png",
            {
                frameWidth: 1024, // adjust to match actual frame width
                frameHeight: 460, // adjust to match actual frame height
            }
        );
    }
    create() {
        // sky
        const sky = this.add.image(0, 0, "sky").setOrigin(0);
        sky.setDisplaySize(this.scale.width, this.scale.height);
        sky.setDepth(-1);
        // menu
        const bg = this.add.image(0, 0, "menuBackground").setOrigin(0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setDepth(3);
        // clouds
        this.anims.create({
            key: "cloudDrift",
            frames: this.anims.generateFrameNumbers("clouds", {
                start: 0,
                end: 3,
            }),
            frameRate: 2,
            repeat: -1,
        });

        const cloudLayer1 = this.add.sprite(200, 100, "clouds");
        cloudLayer1.play("cloudDrift");
        cloudLayer1.setScrollFactor(0.3); // optional parallax effect

        this.cloudLayer1 = this.add.sprite(700, 100, "clouds");
        this.cloudLayer1.play("cloudDrift");
        this.cloudLayer1.setDepth(2); // make sure it's above the background
        this.cloudLayer1 = this.add.sprite(400, 200, "clouds");
        this.cloudLayer1.play("cloudDrift");
        this.cloudLayer1.setDepth(2); // make sure it's above the background
        // play button (X, Y, width, height, color, alpha)

        const playZone = this.add.rectangle(300, 810, 320, 100, 0x000000, 0); // invisible
        playZone.setInteractive({ useHandCursor: true });
        playZone.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
        this.add.text(300, 250, "Top-Down Shooter", {
            fontSize: "32px",
            fill: "#fff",
        });
        this.add.text(300, 300, "Press SPACE to Start", {
            fontSize: "20px",
            fill: "#ccc",
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("GameScene");
        });
        this.anims.create({
            key: "boltFlash",
            frames: this.anims.generateFrameNumbers("lightning", {
                start: 0,
                end: 2,
            }),
            frameRate: 8,
            repeat: 0,
        });
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 1500), // 5–15 seconds
            callback: () => {
                const bolt = this.add.sprite(550, 200, "lightning");
                bolt.play("boltFlash");
                bolt.on("animationcomplete", () => bolt.destroy());
            },
            loop: true,
        });
        this.lightning.setDepth(1); // make sure it's above the clouds
    }
}
