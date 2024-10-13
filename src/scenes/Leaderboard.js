export class Leaderboard extends Phaser.Scene { 
    constructor() {
        super('Leaderboard');
        this.leaderboardTexts = [];  // Array to store text objects
    }

    fetchLeaderboard() {
        fetch('http://localhost:3000/leaderboard')
            .then(response => response.json())
            .then(data => {
                // Update the leaderboard display with real-time data
                this.updateLeaderboardDisplay(data);
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }

    updateLeaderboardDisplay(data) {
        // Clear the existing text objects
        this.leaderboardTexts.forEach(text => text.destroy());
        this.leaderboardTexts = [];

        // Coordinates for leaderboard slots matching the layout from the image
        const leaderboardSlots = [

            { x: 320, y: 290 },
            { x: 320, y: 365 },
            { x: 320, y: 450 },
            { x: 320, y: 530 },
            { x: 320, y: 610 },
            { x: 320, y: 690 },
            { x: 320, y: 770 },
            { x: 320, y: 850 },
            { x: 320, y: 930 },
            { x: 320, y: 1015 },
            { x: 320, y: 1100 },

   
        ];

        // Add the updated text objects
        data.forEach((player, index) => {
            if (index < 12) { // Only show top 12 players
                const { x, y } = leaderboardSlots[index];

                // Trimming the user address to show the first 4 and last 4 characters
                const trimmedAddress = `${player.userAddress.slice(0, 4)}${player.userAddress.slice(-4)}`;
                
                // Creating the text that includes the trimmed address and player score with increased spacing
                const leaderboardText = this.add.text(x, y, `${trimmedAddress}     ${player.score}`, {
                    fontSize: '32px',
                    fill: '#fff',
                    fontFamily: 'Arial Black'
                });
                
                this.leaderboardTexts.push(leaderboardText);
            }
        });
    }

    preload() {
        // Load assets
        this.load.image('Leader_board', 'assets/ui/background/Leader_board.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('ShareOnX', 'assets/ui/background/Share_on_X.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_play2', 'assets/ui/background/button_play2.svg');
    }

    create() {
        const score = this.registry.get('highscore');

        // Set up the background
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);
        const stars = this.add.image(512, 680, `Leader_board`).setOrigin(0.5);
        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.23 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Adding the main buttons (Exit, Play)
        const playButton = this.add.image(400, 1240, 'button_play2').setScale(0.8).setInteractive();
        const exitButton = this.add.image(600, 1240, 'button_exit').setScale(0.8).setInteractive();

        const shareOnXButton = this.add.image(512, 1450, 'ShareOnX').setScale(0.17).setInteractive();
        const inviteFriendsButton = this.add.image(512, 1600, 'InviteFriends').setScale(0.17).setInteractive();

        // Button click interactions
        playButton.on('pointerdown', () => {
            console.log('Play Clicked');
            this.scene.start('HallOfFame'); // Go to HallOfFame scene
        });

        exitButton.on('pointerdown', () => {
            console.log('Exit Clicked');
        });

        inviteFriendsButton.on('pointerdown', () => {
            console.log('Invite Friends Clicked');
        });

        shareOnXButton.on('pointerdown', () => {
            console.log('Share on X Clicked');
        });

        this.addHoverEffect(playButton);
        this.addHoverEffect(exitButton);
        this.addHoverEffect(inviteFriendsButton);
        this.addHoverEffect(shareOnXButton);

        const bonusText = 'Invite friends to play.\nBoth you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1720, bonusText, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            lineSpacing: 5
        });

        // Fetch and display leaderboard data initially
        this.fetchLeaderboard();

        // Set an interval to refresh the leaderboard every 5 seconds
        this.time.addEvent({
            delay: 5000, // Refresh every 5 seconds
            callback: this.fetchLeaderboard,
            callbackScope: this,
            loop: true
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
