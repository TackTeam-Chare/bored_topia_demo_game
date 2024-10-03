export class GameOver extends Phaser.Scene { 
    constructor() {
        super('GameOver');
    }

    preload() {
        // Load assets
        this.load.image('LevelCompletePage', 'assets/ui/background/Level_complete_page.png');
        this.load.image('Level_complete', 'assets/ui/background/Level_complete.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('ShareOnX', 'assets/ui/background/Share_on_X.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_play', 'assets/ui/background/button_play.svg');
    }

    create() {
        const score = this.registry.get('highscore');

        // Set up the background and house image
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

        // Display stars based on the player's score
        let starLevel;
        if (score >= 100) {
            starLevel = 3;
        } else if (score >= 50) {
            starLevel = 2;
        } else if (score >= 20) {
            starLevel = 1;
        } else {
            starLevel = 0;
        }

        const stars = this.add.image(512, 980, `Level_complete`).setOrigin(0.5);
        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.2 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Display score text
        const scoreBoxTextStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        const scoreText = this.add.text(550, 1045, `${score}`, scoreBoxTextStyle).setAlign('center').setOrigin(0.5);
        this.tweens.add({
            targets: scoreText,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Adding the main buttons (Exit, Leaderboard, Play)
        const playButton = this.add.image(500, 1220, 'button_play').setScale(0.7).setInteractive();
        const leaderboardButton = this.add.image(330, 1220, 'button_leaderboard').setScale(0.7).setInteractive();
        const exitButton = this.add.image(680, 1220, 'button_exit').setScale(0.7).setInteractive();

        // Adding Invite Friends and Share buttons with adjusted size
        const inviteFriendsButton = this.add.image(512, 1400, 'InviteFriends').setScale(0.175).setInteractive();
        const shareOnXButton = this.add.image(512, 1550, 'ShareOnX').setScale(0.175).setInteractive();

        // Button click interactions
        playButton.on('pointerdown', () => {
            console.log('Play Clicked');
            // Add functionality here (e.g., restarting the level or moving to the next one)
        });

        leaderboardButton.on('pointerdown', () => {
            console.log('Leaderboard Clicked');
            // Add functionality here (e.g., showing the leaderboard)
        });

        exitButton.on('pointerdown', () => {
            console.log('Exit Clicked');
            // Add functionality here (e.g., returning to the main menu)
        });

        inviteFriendsButton.on('pointerdown', () => {
            console.log('Invite Friends Clicked');
            // Add functionality here
        });

        shareOnXButton.on('pointerdown', () => {
            console.log('Share on X Clicked');
            // Add functionality here
        });

        // Adding hover effects to buttons
        this.addHoverEffect(playButton);
        this.addHoverEffect(leaderboardButton);
        this.addHoverEffect(exitButton);
        this.addHoverEffect(inviteFriendsButton);
        this.addHoverEffect(shareOnXButton);

        // Typing effect for the invite message
        const bonusText = 'Invite friends to play.\nBoth you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1700, bonusText, { 
            fontSize: '30px', 
            fontFamily: 'Arial', 
            color: '#ffffff',
            lineSpacing: 5
        });

        // Return to the main menu when clicking anywhere
        this.input.once('pointerdown', () => {
            this.registry.set('highscore', 0);
            this.scene.start('MainMenu');
        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    // Function to create the typing effect for the text
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
