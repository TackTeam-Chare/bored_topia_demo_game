export class Achievement extends Phaser.Scene {  
    constructor() {
        super('Achievement');
    }

    preload() {
        // Load assets
        this.load.image('Achievement', 'assets/ui/background/Achievement.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_setting', 'assets/ui/background/button_setting.svg');
    }   

    create() {
        const score = this.registry.get('highscore');

        // Set up the background and house image
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);
        const stars = this.add.image(512, 680, `Achievement`).setOrigin(0.5);
        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.25 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Adding the main buttons (Setting, Exit, Leaderboard)
        const playButton = this.add.image(510, 890, 'button_setting').setScale(0.7).setInteractive(); // Adjusted position
        const exitButton = this.add.image(630, 890, 'button_exit').setScale(0.7).setInteractive();
        const leaderboardButton = this.add.image(380, 890, 'button_leaderboard').setScale(0.7).setInteractive(); // Adjusted position

        const inviteFriendsButton = this.add.image(512, 1200, 'InviteFriends').setScale(0.17).setInteractive(); // Moved to fit bonusText

        // Button click interactions
        playButton.on('pointerdown', () => {
            console.log('Play Clicked');
        });

        exitButton.on('pointerdown', () => {
            console.log('Exit Clicked');
        });

        inviteFriendsButton.on('pointerdown', () => {
            console.log('Invite Friends Clicked');
        });

        this.addHoverEffect(playButton);
        this.addHoverEffect(leaderboardButton);
        this.addHoverEffect(exitButton);
        this.addHoverEffect(inviteFriendsButton);

        // Add bonusText at the bottom of the screen
        const bonusText = 'Invite friends to play. Both you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1400, bonusText, { // Adjusted y value to 1650 (bottom)
            fontSize: '32px', 
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
