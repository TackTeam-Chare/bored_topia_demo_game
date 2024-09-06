import { Scene } from 'phaser';

export class HowToPlay extends Scene {
    constructor() {
        super('HowToPlay');
        this.typingText = '';
        this.fullText = 'Click on the coins as they fall to earn points.\nGolden coins give you more points.\nAvoid missing coins to keep your streak alive.\nGet as many points as possible before time runs out!'; // Instructions for the coin clicker game
        this.textIndex = 0;
    }

    preload() {
        this.load.setPath('assets/ui/background/');
        this.load.image('howToPlayBackground', 'HowToPlayPage.png');
        this.load.image('howToPlaySign', 'HowToPlaySign.png');
    }

    create() {
        const howToPlayBg = this.add.image(0, 0, 'howToPlayBackground').setOrigin(0, 0);
        howToPlayBg.setScale(Math.max(this.sys.game.config.width / howToPlayBg.width, this.sys.game.config.height / howToPlayBg.height));

        const howToPlaySign = this.add.image(512, 430, 'howToPlaySign').setScale(0.2);

        this.tweens.add({
            targets: howToPlaySign,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const instructionsText = this.add.text(250, 250, '', {
            fontFamily: 'Arial',
            fontSize: '26px',
            color: '#ffffff',
            wordWrap: { width: 440 },
            align: 'left',
            lineSpacing: 10
        });

        this.typeText(instructionsText);

        this.input.once('pointerdown', () => {
            this.scene.start('ClickerGame');
        });
    }

    typeText(instructionsText) {
        if (this.textIndex < this.fullText.length) {
            this.typingText += this.fullText[this.textIndex];
            instructionsText.setText(this.typingText);
            this.textIndex++;
            this.time.delayedCall(50, () => this.typeText(instructionsText));
        }
    }
}
