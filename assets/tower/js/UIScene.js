export default class UIScene extends Phaser.Scene {
    constructor() {
        super("UIScene");
    }

    preload() {
        // Replace these filenames with your actual icon filenames if different
        this.load.image("icon-sound-on", "assets/tower/images/unmute.png");
        this.load.image("icon-sound-off", "assets/tower/images/mute.png");
    }

    create() {
        // read saved mute preference (default false)
        const saved = localStorage.getItem("gameMuted");
        const isMuted = saved === "1";

        // apply to Phaser sound manager (global)
        this.sound.mute = !!isMuted;

        // create icon
        const cam = this.cameras.main;
        const padding = 12;
        const key = this.sound.mute ? "icon-sound-off" : "icon-sound-on";
        this.soundIcon = this.add
            .image(cam.width - padding, padding, key)
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1000)
            .setScale(0.05)
            .setInteractive({ useHandCursor: true });

        // helper to update the texture so it's always in sync with this.sound.mute
        const updateIcon = () => {
            const tex = this.sound.mute ? "icon-sound-off" : "icon-sound-on";
            if (this.soundIcon && this.soundIcon.setTexture)
                this.soundIcon.setTexture(tex);
        };

        // ensure icon matches actual mute state (covers race conditions)
        updateIcon();
        // small debug log to help diagnose mismatch issues
        // console.log('UIScene: sound.mute=', this.sound.mute, 'initialKey=', key);

        // reposition helper
        const placeIcon = () => {
            const c = this.cameras.main;
            this.soundIcon.setPosition(c.width - padding, padding);
        };

        // handle resize/orientation
        this.scale.on("resize", placeIcon);

        // toggle handler
        this.soundIcon.on("pointerdown", () => {
            this.sound.mute = !this.sound.mute;
            this.soundIcon.setTexture(
                this.sound.mute ? "icon-sound-off" : "icon-sound-on"
            );
            localStorage.setItem("gameMuted", this.sound.mute ? "1" : "0");
        });

        // keyboard toggle (M)
        this.input.keyboard.on("keydown-M", () => {
            this.sound.mute = !this.sound.mute;
            if (this.soundIcon && this.soundIcon.setTexture)
                this.soundIcon.setTexture(
                    this.sound.mute ? "icon-sound-off" : "icon-sound-on"
                );
            localStorage.setItem("gameMuted", this.sound.mute ? "1" : "0");
        });
    }
}
