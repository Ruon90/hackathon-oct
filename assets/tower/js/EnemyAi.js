export default class EnemyAi extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, player) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.state = "IDLE";
        this.speed = 100;

        this.patrolPoints = ["left", "up", "right", "down"];
        this.patrolIndex = 0;
        this.nextPatrolTime = 0;

        this.detectionRange = 200;
        this.attackRange = 50;
    }

    update(time) {
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
    }

    patrol(time) {
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
            this.nextPatrolTime = time + 2000; // 2 seconds per direction
        }
    }

    chase() {
        this.scene.physics.moveToObject(this, this.player, this.speed);
    }

    attack() {
        this.setVelocity(0, 0);
        // Add attack animation or damage logic here
    }
}
