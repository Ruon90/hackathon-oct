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
        this.load.spritesheet("clouds2", "assets/tower/images/clouds2.png", {
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
        this.load.audio("menuMusic", "assets/tower/audio/menu_music.mp3");
        this.load.audio("rainfall", "assets/tower/audio/rainfall.mp3");
        this.load.audio("lightning", "assets/tower/audio/lightning.mp3");
        this.load.spritesheet("raindrop", "assets/tower/images/raindrop.png", {
            frameWidth: 600, // adjust to match actual frame width
            frameHeight: 900, // adjust to match actual frame height
        });
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
        this.anims.create({
            key: "cloudDrift2",
            frames: this.anims.generateFrameNumbers("clouds2", {
                start: 0,
                end: 3,
            }),
            frameRate: 2,
            repeat: -1,
        });
        this.anims.create({
            key: "rainFall",
            frames: this.anims.generateFrameNumbers("raindrop", {
                start: 0,
                end: 2,
            }),
            frameRate: 5,
            repeat: -1,
        });
        const rainLayer = this.add.sprite(150, 370, "raindrop");
        rainLayer.play("rainFall");
        rainLayer.setScrollFactor(0.1);
        rainLayer.setDepth(1); // make sure it's above the background
        rainLayer.setAlpha(0.46); // make it semi-transparent
        rainLayer.setScale(0.8); // scale to cover more area
        rainLayer.rotation = 0.1; // slight tilt for effect
        const rainLayer2 = this.add.sprite(450, 370, "raindrop");
        rainLayer2.play("rainFall");
        rainLayer2.setScrollFactor(0.1);
        rainLayer2.setDepth(1);
        rainLayer2.setAlpha(0.46); // make it semi-transparent
        rainLayer2.setScale(0.8); // scale to cover more area
        rainLayer2.rotation = 0.1; // slight tilt for effect
        const cloudLayer1 = this.add.sprite(200, 100, "clouds");
        cloudLayer1.play("cloudDrift");
        cloudLayer1.setScrollFactor(0.3); // optional parallax effect
        cloudLayer1.setDepth(2); // make sure it's above the background
        this.cloudLayer1 = this.add.sprite(-50, 200, "clouds").setScale(0.8);
        this.cloudLayer1.play("cloudDrift");
        this.cloudLayer1.setDepth(-1); // make sure it's above the background
        this.cloudLayer1 = this.add.sprite(700, 100, "clouds");
        this.cloudLayer1.play("cloudDrift");
        this.cloudLayer1.setDepth(2); // make sure it's above the background
        this.cloudLayer1 = this.add.sprite(400, 200, "clouds");
        this.cloudLayer1.play("cloudDrift");
        this.cloudLayer1.setDepth(2); // make sure it's above the background
        const cloudLayer2 = this.add.sprite(0, 100, "clouds2");
        this.cloudLayer2 = this.add.sprite(300, 100, "clouds2");
        this.cloudLayer2.play("cloudDrift2");
        this.cloudLayer2 = this.add.sprite(500, 100, "clouds2");
        this.cloudLayer2.play("cloudDrift2");
        this.cloudLayer2.setDepth(1); // make sure it's above the background
        cloudLayer2.play("cloudDrift2");
        cloudLayer2.setScrollFactor(0.5); // optional parallax effect
        cloudLayer2.setDepth(1);
        // rain

        const playZone = this.add.rectangle(300, 810, 320, 100, 0x000000, 0); // invisible
        playZone.setInteractive({ useHandCursor: true });
        playZone.on("pointerdown", () => {
            this.menuMusic.stop();
            this.rainfall.stop();
            this.lightning.stop();
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
            delay: Phaser.Math.Between(3500, 9000), // 2.5–9 seconds
            callback: () => {
                const bolt = this.add.sprite(550, 200, "lightning");
                bolt.setDepth(1);
                bolt.play("boltFlash");
                this.lightning.play(); // sound effect
                this.cameras.main.flash(100, 180, 220, 255); //camera effect settings
                this.cameras.main.shake(100, 0.01);
                bolt.on("animationcomplete", () => bolt.destroy());
            },
            loop: true,
        });
        this.time.addEvent({
            delay: Phaser.Math.Between(4500, 12400), // 4.5–12.4 seconds
            callback: () => {
                const bolt = this.add.sprite(15, 200, "lightning");
                bolt.setDepth(1);
                bolt.play("boltFlash");
                this.lightning.play(); // sound effect2
                this.cameras.main.flash(100, 180, 220, 255); //camera effect settings
                this.cameras.main.shake(100, 0.01);
                bolt.on("animationcomplete", () => bolt.destroy());
            },
            loop: true,
        });
        // background music
        this.lightning = this.sound.add("lightning", { volume: 0.5 });
        this.rainfall = this.sound.add("rainfall", {
            loop: true,
            volume: 0.4,
        });
        this.menuMusic = this.sound.add("menuMusic", {
            loop: true,
            volume: 0.7,
        });
        this.menuMusic.play();
        this.rainfall.play();
        this.input.once("pointerdown", () => {});
    }
}
