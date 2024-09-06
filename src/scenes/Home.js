import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.setPath('assets/ui/background/');
        this.load.image('logo', 'logo.png');
        this.load.image('Start1', 'Start1.svg');
        this.load.image('Start2', 'Start2.svg');
        this.load.image('Start3', 'Start3.svg');
        this.load.image('Start4', 'Start4.svg');
        this.load.image('OpeningPage', 'OpeningPage.png');
    }

    create() {

        const bg = this.add.image(0, 0, 'OpeningPage').setOrigin(0, 0);
        bg.setScale(Math.max(this.sys.game.config.width / bg.width, this.sys.game.config.height / bg.height));

        const logo = this.add.image(512, 400, 'logo').setScale(0.25);
        this.tweens.add({
            targets: logo,
            y: 290,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startButtonScale = Math.min(this.sys.game.config.width / 800, this.sys.game.config.height / 600) * 2.5;

        const startButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 100, 'Start1')
            .setInteractive()
            .setScale(startButtonScale);

        const marginBottom = 30;
        startButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - startButton.displayHeight / 2 - marginBottom);

        const pulsingTween = this.tweens.add({
            targets: startButton,
            scaleX: startButtonScale * 0.95,
            scaleY: startButtonScale * 0.95,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        startButton.on('pointerover', () => {
            pulsingTween.pause();
            this.tweens.add({
                targets: startButton,
                scaleX: startButtonScale * 1.05,
                scaleY: startButtonScale * 1.05,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
        });

        startButton.on('pointerout', () => {
            this.tweens.add({
                targets: startButton,
                scaleX: startButtonScale * 0.95,
                scaleY: startButtonScale * 0.95,
                duration: 200,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    pulsingTween.resume();
                }
            });
        });

        startButton.on('pointerdown', () => {
            this.time.delayedCall(500, () => {
                startButton.setTexture('Start2');
            });

            this.time.delayedCall(1000, () => {
                startButton.setTexture('Start3');
            });

            this.time.delayedCall(1500, () => {
                startButton.setTexture('Start4');
            });

            this.time.delayedCall(2500, () => {
                this.scene.start('HowToPlay');
            });
        });
    }
}
