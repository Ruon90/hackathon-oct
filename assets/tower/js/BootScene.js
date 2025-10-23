export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("loadingBar", "assets/tower/images/loadingBar.png");
    }

    create() {
        this.scene.start("LoadingScene"); // move to full preload once barBg is ready
    }
}
