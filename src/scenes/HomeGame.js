import { Scene } from 'phaser';

export class HomeGame extends Scene {
    constructor() {
        super('HomeGame');
    }

    create() {

        // Add the background image
        this.add.image(512, 384, 'OpeningPage');

        // Add the logo image and make it smaller
        const logo = this.add.image(512, -270, 'logo').setScale(0.5); // Adjust scale to 0.5 for a smaller logo

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1000,
            ease: 'Bounce'
        });

        const startButtonText = this.add.text(512, 500, 'Start Game', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        })
        .setOrigin(0.5) // Center the text
        .setInteractive({ cursor: 'pointer' });

        // Add hover effect
        startButtonText.on('pointerover', () => {
            startButtonText.setStyle({ fill: '#ff0', fontSize: '52px' }); 
        });

        startButtonText.on('pointerout', () => {
            startButtonText.setStyle({ fill: '#ffffff', fontSize: '48px' }); 
        });

        // Start the game on pointer down
        startButtonText.on('pointerdown', () => {
            this.scene.start('ClickerGame');
        });
    }
}
