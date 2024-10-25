export class GameOver extends Phaser.Scene {  
    constructor() {
        super('GameOver');
    }

    preload() {
        // Load assets
        this.load.image('LevelCompletePage', 'assets/ui/background/Level_complete_page.png');
        this.load.image('Level_complete', 'assets/ui/background/Level_complete.png');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_play', 'assets/ui/background/button_play2.svg');
    }

    create(data) {
        const score = data.score || 0;
        const roomId = data.roomId || 'N/A';
        console.log(`Game over screen for Room ID: ${roomId}, Score: ${score}`);
        this.registry.set('highscore', score);

        // Set up the background and animated house image
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);
        const animatedHouse = this.add.image(512, 300, 'LevelCompletePage').setScale(0.15).setOrigin(0.5);

        this.tweens.add({
            targets: animatedHouse,
            y: '+=30',
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

       

        const stars = this.add.image(512, 980, `Level_complete`).setOrigin(0.5);

        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.2 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Display score text
        const scoreBoxTextStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        const scoreText = this.add.text(630, 1045, `${score}`, scoreBoxTextStyle)
            .setAlign('center')
            .setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Add the play button
        const playButton = this.add.image(500, 1220, 'button_play').setScale(1).setInteractive();

        playButton.on('pointerdown', () => {
            console.log('Leaderboard');
            // this.scene.start('Leaderboard', { roomId });
            this.scene.start('Leaderboard', { roomId: data.roomId || 'default-room-id' });

        });

        // Add hover effect to the play button
        this.addHoverEffect(playButton);

        // **Auto-redirect to the Leaderboard after 3 seconds**
        this.time.delayedCall(3000, () => {
            console.log('Auto-redirecting to Leaderboard...');
            // this.scene.start('Leaderboard', { roomId });
            this.scene.start('Leaderboard', { roomId: data.roomId || 'default-room-id' });

        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    // Optional: Function to create the typing effect for the text
    addTypingEffect(x, y, text, style) {
        const textObject = this.add.text(x, y, '', style).setOrigin(0.5);
        let index = 0;

        this.time.addEvent({
            delay: 50, // Speed of typing effect
            callback: () => {
                textObject.text += text[index];
                index++;
                if (index >= text.length) {
                    this.time.removeAllEvents(); // Stop when finished
                }
            },
            repeat: text.length - 1
        });
    }
}
