import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const score = this.registry.get('highscore');

        // Star thresholds
        let starLevel;
        if (score >= 100) {
            starLevel = 3; // 3 stars for a score of 100 or higher
        } else if (score >= 50) {
            starLevel = 2; // 2 stars for a score of 50 or higher
        } else if (score >= 20) {
            starLevel = 1; // 1 star for a score of 20 or higher
        } else {
            starLevel = 0; // 0 stars for any score less than 20
        }

        this.add.image(512, 384, 'BG');

        const starImageKey = `PgScore_${starLevel}star`; // Select the  image star level
        const stars = this.add.image(512, 1300, starImageKey).setOrigin(0.5);

        this.tweens.add({
            targets: stars,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        const scoreBoxTextStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        const scoreText = this.add.text(600, 1365, `${score}`, scoreBoxTextStyle).setAlign('center').setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        const animatedHouse = this.add.image(512, 450, 'Level_Complete').setScale(0.2).setOrigin(0.5);
        this.tweens.add({
            targets: animatedHouse,
            y: '+=30',
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: animatedHouse,
            alpha: { from: 0.7, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.input.once('pointerdown', () => {
            // Reset score
            this.registry.set('highscore', 0);
            this.scene.start('MainMenu');
        });
    }
}
