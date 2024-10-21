import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('Start', 'assets/ui/background/Start.svg');
        this.load.image('Load_1', 'assets/ui/background/Load_1.svg');
        this.load.image('Load_2', 'assets/ui/background/Load_2.svg');
        this.load.image('Load_3', 'assets/ui/background/Load_3.svg');
        this.load.image('OpeningPage', 'assets/ui/background/OpeningPage.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'OpeningPage').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        const logo = this.add.image(this.scale.width / 2, 350, 'logo').setScale(0.3);
        this.tweens.add({
            targets: logo,
            y: 290,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        let startButtonScale = Math.min(this.scale.width / 800, this.scale.height / 600) * 1.5;

        const marginBottom = this.scale.height * 0.1;

        const startButton = this.add.image(this.scale.width / 2, this.scale.height - marginBottom, 'Start')
            .setInteractive()
            .setScale(startButtonScale);

        startButton.setPosition(this.scale.width / 2, this.scale.height - startButton.displayHeight / 2 - marginBottom);

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
                startButton.setTexture('Load_1');
            });

            this.time.delayedCall(1000, () => {
                startButton.setTexture('Load_2');
            });

            this.time.delayedCall(1500, () => {
                startButton.setTexture('Load_3');
            });

            this.time.delayedCall(2500, () => {
                this.scene.start('HowToPlay');
            });
        });
    }
}
