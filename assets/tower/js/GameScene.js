export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
    }

    preload() {
        this.load.spritesheet(
            "player",
            "assets/tower/images/tsprite_shoot2.png",
            {
                frameWidth: 322,
                frameHeight: 450,
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
        // world bounds
        this.physics.world.setBounds(0, 0, 1600, 1200);

        // Add background
        const background = this.add.image(800, 600, "background");

        this.player = this.physics.add.sprite(800, 621, "player");
        this.lastFired = 0;
        this.fireRate = 1500; // milliseconds between shots
        this.player.canMove = true;
        this.player.setDepth(2);
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
            .setDrag(500, 500)
            .setScale(0.25);

        this.bullets = this.physics.add.group({});
        this.enemies = this.physics.add.group();
        // wall collision
        const wallData = [
            {
                x: 740,
                y: 219,
                displayW: 1118,
                displayH: 29,
                bodyW: 1118,
                bodyH: 29,
            },
            {
                x: 770,
                y: 1,
                displayW: 1460,
                displayH: 29,
                bodyW: 1460,
                bodyH: 29,
            },
            {
                x: 800,
                y: 205,
                displayW: 25,
                displayH: 370,
                bodyW: 25,
                bodyH: 370,
            },
            {
                x: 800,
                y: 395,
                displayW: 250,
                displayH: 25,
                bodyW: 250,
                bodyH: 25,
            },
            {
                x: 322,
                y: 405,
                displayW: 25,
                displayH: 340,
                bodyW: 25,
                bodyH: 340,
            },
            {
                x: 322,
                y: 845,
                displayW: 25,
                displayH: 250,
                bodyW: 25,
                bodyH: 250,
            },
            {
                x: 322,
                y: 960,
                displayW: 675,
                displayH: 30,
                bodyW: 675,
                bodyH: 30,
            },
            {
                x: 645,
                y: 855,
                displayW: 25,
                displayH: 210,
                bodyW: 25,
                bodyH: 210,
            },
            {
                x: 959,
                y: 855,
                displayW: 25,
                displayH: 210,
                bodyW: 25,
                bodyH: 210,
            },
            {
                x: 985,
                y: 1205,
                displayW: 25,
                displayH: 210,
                bodyW: 25,
                bodyH: 210,
            },
            {
                x: 615,
                y: 1205,
                displayW: 25,
                displayH: 210,
                bodyW: 25,
                bodyH: 210,
            },
            {
                x: 320,
                y: 1195,
                displayW: 580,
                displayH: 25,
                bodyW: 580,
                bodyH: 25,
            },
            {
                x: 800,
                y: 540,
                displayW: 220,
                displayH: 15,
                bodyW: 220,
                bodyH: 15,
            },
            {
                x: 1285,
                y: 410,
                displayW: 25,
                displayH: 345,
                bodyW: 25,
                bodyH: 345,
            },
            {
                x: 1585,
                y: 310,
                displayW: 25,
                displayH: 465,
                bodyW: 25,
                bodyH: 465,
            },
            {
                x: 1485,
                y: 25,
                displayW: 195,
                displayH: 135,
                bodyW: 195,
                bodyH: 135,
            },
            {
                x: 680,
                y: 580,
                displayW: 15,
                displayH: 92,
                bodyW: 15,
                bodyH: 92,
            },
            {
                x: 931,
                y: 580,
                displayW: 15,
                displayH: 89,
                bodyW: 15,
                bodyH: 89,
            },
            {
                x: 1273,
                y: 971,
                displayW: 650,
                displayH: 25,
                bodyW: 650,
                bodyH: 25,
            },
            {
                x: 1295,
                y: 855,
                displayW: 25,
                displayH: 250,
                bodyW: 25,
                bodyH: 250,
            },
            {
                x: 1265,
                y: 1191,
                displayW: 650,
                displayH: 20,
                bodyW: 650,
                bodyH: 20,
            },
            {
                x: 1590,
                y: 1010,
                displayW: 24,
                displayH: 650,
                bodyW: 25,
                bodyH: 650,
            },
            {
                x: 10,
                y: 1010,
                displayW: 24,
                displayH: 650,
                bodyW: 24,
                bodyH: 650,
            },
            {
                x: 10,
                y: 250,
                displayW: 24,
                displayH: 650,
                bodyW: 24,
                bodyH: 650,
            },
        ];
        this.walls = this.physics.add.staticGroup();

        wallData.forEach(({ x, y, displayW, displayH, bodyW, bodyH }) => {
            this.walls
                .create(x, y)
                .setDisplaySize(displayW, displayH)
                .setSize(bodyW, bodyH)
                .setVisible(false) // or true for debugging
                .refreshBody();
        });
        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.bullets, this.walls, (bullet, wall) => {
            // Create impact sprite at bullet position
            const impact = this.add.sprite(bullet.x, bullet.y, "wall_impact");
            impact.setScale(0.2);
            impact.play("wall_impact");
            const bulletHit = this.sound.add("bulletHit", { volume: 0.85 });
            bulletHit.play();

            // Destroy bullet immediately
            bullet.destroy();

            // Remove impact sprite after animation completes
            impact.on("animationcomplete", () => impact.destroy());
        });
        this.physics.add.overlap(this.bullets, this.walls, (bullet, wall) => {
            bullet.destroy();
        });
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
        this.anims.create({
            key: "wall_impact",
            frames: this.anims.generateFrameNumbers("wall_impact", {
                start: 0,
                end: 2,
            }),
            frameRate: 9,
            repeat: 0,
        });
        this.anims.create({
            key: "enemy_impact",
            frames: this.anims.generateFrameNumbers("enemy_impact", {
                start: 0,
                end: 2,
            }),
            frameRate: 9,
            repeat: 0,
        });

        this.input.on("pointerdown", () => {
            const now = this.time.now;

            if (this.player) {
                if (now - this.lastFired > this.fireRate) {
                    this.player.anims.play("shoot", true);
                    this.fireBullet(); // your bullet firing function
                    this.lastFired = now;
                    // Stop player movement while shooting
                    this.player.canMove = false;

                    this.time.delayedCall(500, () => {
                        this.player.canMove = true;
                    });
                }
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

        this.gameMusic = this.sound.add("gameMusic", {
            loop: true,
            volume: 0.6,
        });
        this.gameMusic.play();
    }

    update() {
        const isShooting =
            this.player.anims &&
            this.player.anims.currentAnim &&
            this.player.anims.currentAnim.key === "shoot" &&
            this.player.anims.isPlaying;

        this.player.setVelocity(0);
        if (this.player.canMove) {
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
        bullet.setScale(0.2);
        bullet.setOrigin(0.5, 0.5); // X = center, Y = lower down
        bullet.setDepth(1);
        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            this.mouseX,
            this.mouseY
        );
        this.physics.velocityFromRotation(angle, 700, bullet.body.velocity);

        bullet.setRotation(angle); // Optional: rotate bullet to face direction
        bullet.body.angle = angle;
        this.player.anims.play("shoot", true);
        this.player.setVelocity(0); // Stop player movement while shooting
        this.gunshot = this.sound.add("gunshot", { volume: 0.5 });
        this.gunshot.play();
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
        // Create impact sprite at enemy position
        const impact = this.add.sprite(enemy.x, enemy.y, "enemy_impact");
        impact.setScale(0.4);
        impact.play("enemy_impact");
        // Remove impact sprite after animation completes
        impact.on("animationcomplete", () => impact.destroy());
        bullet.destroy();
        const eDestroy = this.sound.add("enemyDestroy", { volume: 0.85 });
        eDestroy.play();

        enemy.destroy();

        this.score += 1;
        this.scoreText.setText("Score: " + this.score);
    }
}
