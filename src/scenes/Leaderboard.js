export class Leaderboard extends Phaser.Scene { 
    fetchLeaderboard() {
        fetch('http://localhost:3000/leaderboard')
            .then(response => response.json())
            .then(data => {
                // Coordinates for leaderboard slots
                const leaderboardSlots = [
                    { x: 200, y: 200 }, // Position for the first slot (1st place)
                    { x: 200, y: 260 }, // Position for the second slot (2nd place)
                    { x: 200, y: 320 }, // Position for the third slot (3rd place)
                    { x: 200, y: 380 }, // Continue for other ranks
                    { x: 200, y: 440 },
                    { x: 200, y: 500 },
                    { x: 200, y: 560 },
                    { x: 200, y: 620 },
                    { x: 200, y: 680 },
                    { x: 200, y: 740 },
                    { x: 200, y: 800 },
                    { x: 200, y: 860 }
                ];

                data.forEach((player, index) => {
                    if (index < 12) { // Only show top 12 players
                        const { x, y } = leaderboardSlots[index];
                        this.add.text(x, y, `${index + 1}. ${player.userAddress}: ${player.score}`, {
                            fontSize: '32px',
                            fill: '#fff',
                            fontFamily: 'Arial Black'
                        });
                    }
                });
            })
            .catch(error => console.error('Error fetching leaderboard:', error));
    }

    constructor() {
        super('Leaderboard');
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

        // Fetch and display leaderboard data
        this.fetchLeaderboard();
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
