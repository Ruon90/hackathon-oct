export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
    }

    preload() {
        this.load.spritesheet(
            "player",
            "assets/tower/images/tsprite_shoot.png",
            {
                frameWidth: 322,
                frameHeight: 338,
            }
        );
        this.load.image("bullet", "assets/tower/images/bullet_static.png");
        this.load.image("enemy", "assets/tower/images/enemy_static.png");
        this.load.image("background", "assets/tower/images/level.jpg");
        this.load.spritesheet(
            "playerWalk",
            "assets/tower/images/playerWalk.png",
            {
                frameWidth: 322, // adjust to your sprite frame width
                frameHeight: 450, // adjust to your sprite frame height
            }
        );
    }

    create() {
        // world bounds
        this.physics.world.setBounds(0, 0, 1600, 1200);

        // Add background
        const background = this.add.image(800, 600, "background");

        this.player = this.physics.add.sprite(800, 600, "player");
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        // Camera settings
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.8); // Default is 1. Lower = zoom out
        this.cameras.main.setBounds(0, 0, 1600, 1200);

        background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
        // player settings
        this.player
            .setOrigin(0.5, 0.5)
            .setDisplaySize(96, 96)
            .setCollideWorldBounds(true)
            .setDrag(500, 500);

        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        // wall collision
        this.walls = this.physics.add.staticGroup();
        this.walls
            .create(740, 230)
            .setDisplaySize(1125, 25)
            .setSize(1125, 35)
            .setVisible(true)
            .refreshBody();
        this.walls
            .create(800, 210)
            .setDisplaySize(30, 405)
            .setSize(20, 325)
            .setVisible(true)
            .refreshBody();

        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.bullets, this.walls, (bullet) =>
            bullet.destroy()
        );
        this.scoreText = this.add.text(10, 10, "Score: 0", {
            fontSize: "20px",
            fill: "#fff",
        });
        this.scoreText.setScrollFactor(0);
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true,
        });

        this.physics.add.overlap(
            this.bullets,
            this.enemies,
            this.hitEnemy,
            null,
            this
        );

        this.input.on("pointermove", (pointer) => {
            this.mouseX = pointer.worldX;
            this.mouseY = pointer.worldY;
        });
        // Create shoot animation from spritesheet (frames 0-3)
        this.anims.create({
            key: "shoot",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 3,
            }),
            frameRate: 14,
            repeat: 0,
        });
        this.input.on("pointerdown", () => {
            if (this.player) {
                this.player.anims.play("shoot", true);
                this.fireBullet();
            }
        });
        // walk animaiton
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("playerWalk", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });
        // Ensure the player returns to idle after the shoot animation finishes
        if (this.player) {
            this.player.on("animationcomplete", (animation, frame, sprite) => {
                if (animation.key === "shoot") {
                    // reset to idle frame after shooting
                    sprite.setFrame(0);
                }
            });
        }
    }

    update() {
        const isShooting =
            this.player.anims &&
            this.player.anims.currentAnim &&
            this.player.anims.currentAnim.key === "shoot" &&
            this.player.anims.isPlaying;

        this.player.setVelocity(0);

        if (this.keys.left.isDown) {
            this.player.setVelocityX(-200);
        }
        if (this.keys.right.isDown) {
            this.player.setVelocityX(200);
        }
        if (this.keys.up.isDown) {
            this.player.setVelocityY(-200);
        }
        if (this.keys.down.isDown) {
            this.player.setVelocityY(200);
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.fireBullet();
        }
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            pointer.worldX,
            pointer.worldY
        );
        this.player.setRotation(angle + Phaser.Math.DegToRad(-90));
        console.log(this.player.position);
        const moving =
            this.keys.left.isDown ||
            this.keys.right.isDown ||
            this.keys.up.isDown ||
            this.keys.down.isDown;

        // If the shoot animation is currently playing, don't override it with walk/idle

        if (!isShooting) {
            if (moving) {
                this.player.play("walk", true);
            } else {
                this.player.setFrame(0); // reset to idle frame
            }
        }
    }
    fireBullet() {
        const bullet = this.bullets.create(
            this.player.x,
            this.player.y,
            "bullet"
        );
        this.physics.world.enable(bullet);

        bullet.setOrigin(-1.1, 0.4); // X = center, Y = lower down

        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            this.mouseX,
            this.mouseY
        );
        this.physics.velocityFromRotation(angle, 700, bullet.body.velocity);

        bullet.setRotation(angle); // Optional: rotate bullet to face direction
        bullet.setScale(0.2);
        this.player.anims.play("shoot", true);
        this.player.setVelocity(0); // Stop player movement while shooting
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const enemy = this.enemies.create(x, y, "enemy");
        enemy.setVelocity(
            Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(-100, 100)
        );
        enemy.setScale(0.5);
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score += 1;
        this.scoreText.setText("Score: " + this.score);
    }
}
