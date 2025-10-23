export default class EnemyAi extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.state = "IDLE";
        this.speed = 110 + (this.scoreBonus || 0);

        // Freeze flag and flash timer
        this.frozen = false;
        this._flashTimer = null;

        this.patrolPoints = ["left", "up", "right", "down"];
        this.patrolIndex = 0;
        this.nextPatrolTime = 0;

        this.detectionRange = 285 + (this.scoreBonus * 3 || 0);
        this.attackRange = 50;
    }

    update(time) {
        const score = Number(this.scene.score) || 0;
        // tune these multipliers as you like
        this.speed = 110 + score * 1.5; // increase base speed per score
        this.detectionRange = 285 + score * 3; // increase detection per score

        this.isMoving = false;
        if (this.isSpawning) {
            this.setVelocity(0, 0);
            return; // skip movement while spawning
        }
        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        // State transitions
        if (dist < this.attackRange) {
            this.state = "ATTACK";
        } else if (dist < this.detectionRange) {
            this.state = "CHASE";
        } else {
            this.state = "IDLE";
        }

        // State behaviors
        switch (this.state) {
            case "IDLE":
                this.patrol(time);
                break;
            case "CHASE":
                this.chase();
                break;
            case "ATTACK":
                this.attack();
                break;
        }
        // Check velocity to determine movement
        const vx = this.body.velocity.x;
        const vy = this.body.velocity.y;
        this.isMoving = !(vx === 0 && vy === 0);
        if (this.body.blocked.left || this.body.blocked.right) {
            this.setVelocityY(this.body.velocity.y * 1);
        }
        if (this.body.blocked.up || this.body.blocked.down) {
            this.setVelocityX(this.body.velocity.x * 1);
        }
        console.log(
            `Detection Range: ${this.detectionRange}, Attack Range: ${this.attackRange}`
        );
    }

    patrol(time) {
        if (this.frozen) {
            this.setVelocity(0, 0);
            this.isMoving = false;
            return;
        }
        const dir = this.patrolPoints[this.patrolIndex];
        switch (dir) {
            case "left":
                this.setVelocity(-this.speed, 0);
                break;
            case "up":
                this.setVelocity(0, -this.speed);
                break;
            case "right":
                this.setVelocity(this.speed, 0);
                break;
            case "down":
                this.setVelocity(0, this.speed);
                break;
        }

        if (time > this.nextPatrolTime) {
            this.patrolIndex =
                (this.patrolIndex + 1) % this.patrolPoints.length;
            this.nextPatrolTime = time + 3500; // 3.5 seconds per direction
        }
    }

    chase() {
        if (this.frozen) {
            this.setVelocity(0, 0);
            this.isMoving = false;
            return;
        }
        if (this.player._isTransitioning) {
            return;
        }
        this.scene.physics.moveToObject(this, this.player, this.speed + 75);
    }

    attack() {
        if (this.frozen) {
            this.setVelocity(0, 0);
            this.isMoving = false;
            return;
        }
        this.setVelocity(0, 0);
    }

    // Freeze movement and flash transparency for `duration` ms, then unfreeze.
    freezeAndFlash(duration = 700) {
        if (this.frozen) return; // already frozen
        this.frozen = true;

        // Ensure no movement while frozen
        this.setVelocity(0, 0);
        this.isMoving = false;

        const flashInterval = 100; // ms per toggle
        let elapsed = 0;

        // store timer so we can remove it if destroyed
        this._flashTimer = this.scene.time.addEvent({
            delay: flashInterval,
            loop: true,
            callback: () => {
                if (!this.scene || !this.active) {
                    if (this._flashTimer) this._flashTimer.remove();
                    this.alpha = 1;
                    this.frozen = false;
                    return;
                }

                // toggle alpha between full and semi-transparent
                this.alpha = this.alpha === 1 ? 0.2 : 1;
                elapsed += flashInterval;

                if (elapsed >= duration) {
                    if (this._flashTimer) this._flashTimer.remove();
                    this.alpha = 1;
                    this.frozen = false;
                    this._flashTimer = null;
                }
            },
        });

        // Clean up timer if sprite is destroyed before timer completes
        this.once("destroy", () => {
            if (this._flashTimer) {
                try {
                    this._flashTimer.remove();
                } catch (e) {}
                this._flashTimer = null;
            }
            this.alpha = 1;
            this.frozen = false;
        });
    }
}
