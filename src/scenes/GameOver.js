import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        // Get the current highscore from the registry
        const score = this.registry.get('highscore');

        // Define thresholds for stars
        const starThresholds = {
            oneStar: 100,   // Minimum score for 1 star
            twoStars: 300,  // Minimum score for 2 stars
            threeStars: 500 // Minimum score for 3 stars
        };

        // Determine the number of stars based on the score
        let stars = 0;
        if (score >= starThresholds.threeStars) {
            stars = 3;
        } else if (score >= starThresholds.twoStars) {
            stars = 2;
        } else if (score >= starThresholds.oneStar) {
            stars = 1;
        }

        // Load background
        this.add.image(512, 384, 'background_game_over');

        // Display the score
        const textStyle = { fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };
        this.add.text(512, 200, `${score}`, textStyle).setAlign('center').setOrigin(0.5);

        // Display stars based on the score
        const starImages = ['0star', '1star', '2star', '3star'];
        const star = this.add.image(500, 400, `PgScore_${starImages[stars]}`).setOrigin(0.5);

        this.tweens.add({
            targets: star,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // Particle effect after star animation completes
                const particles = this.add.particles('spark'); // Ensure 'spark' is a valid loaded asset

                particles.createEmitter({
                    x: 512,
                    y: 400,
                    speed: { min: -100, max: 100 },
                    scale: { start: 0.1, end: 0 },
                    blendMode: 'ADD',
                    lifespan: 500,
                    quantity: 50,
                    emitZone: { source: new Phaser.Geom.Circle(0, 0, 10) }
                });
            }
        });

        // Add the score to the score box with a subtle pulse effect
        const scoreBoxTextStyle = { fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        const scoreText = this.add.text(570, 460, `${score}`, scoreBoxTextStyle).setAlign('center').setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Input to restart the game
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
