export default class DeathScene extends Phaser.Scene {
    constructor() {
        super("DeathScene");
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.add.text(175, 250, "You Died", {
            fontSize: "32px",
            fill: "#f00",
        });
        this.add.text(200, 300, `Score: ${this.finalScore}`, {
            fontSize: "20px",
            fill: "#fff",
        });
        this.add.text(120, 350, "Press SPACE to Restart", {
            fontSize: "20px",
            fill: "#ccc",
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("GameScene");
        });
    }
}
