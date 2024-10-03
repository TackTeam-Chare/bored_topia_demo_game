export class HallOfFame extends Phaser.Scene {
    constructor() {
        super('HallOfFame');
    }

    preload() {
        // Load background and UI elements
        this.load.image('BG', 'assets/ui/background/BG.png');
        this.load.image('Hall_of_fame', 'assets/ui/background/Hall_of_fame.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('ShareOnX', 'assets/ui/background/Share_on_X.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_play2', 'assets/ui/background/button_play2.svg');
    
        // Load scroll bar and arrow
        this.load.image('scrollArrow', 'assets/ui/background/button_scroll_arrow.svg');
        this.load.image('scrollBar', 'assets/ui/background/button_scroll_bar.svg');
    
        // Load rank images (1-12, 13-24, 25-36, 37-48)
        this.load.image('rank13-24', 'assets/ui/background/13-24.png');
        this.load.image('rank25-36', 'assets/ui/background/25-36.png');
        this.load.image('rank37-48', 'assets/ui/background/37-48.png');
    }

    create() {
        // Set up the background
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);
        const leaderboardBackground = this.add.image(512, 700, 'Hall_of_fame').setOrigin(0.5).setScale(0.45);

        // Images for different ranks
        const rankImages = ['rank13-24', 'rank25-36', 'rank37-48'];
        let currentIndex = -1; // No rank images visible initially

        // Create the rank image holder, but keep it invisible
        let currentRankImage = this.add.image(475, 685, rankImages[0]).setOrigin(0.5).setScale(0.45).setVisible(false);

        // Scroll bar
        const scrollBar = this.add.image(780, 620, 'scrollBar').setScale(5, 5);  // Positioned centrally for better alignment

        // Scroll arrows (up and down) positioned on top and bottom of the scrollBar
        const scrollUpButton = this.add.image(scrollBar.x, scrollBar.y - scrollBar.displayHeight / 2, 'scrollArrow').setScale(0.4).setInteractive();
        const scrollDownButton = this.add.image(scrollBar.x, scrollBar.y + scrollBar.displayHeight / 2, 'scrollArrow').setScale(0.4).setInteractive().setFlipY(true);

        // Scroll up button functionality
        scrollUpButton.on('pointerdown', () => {
            if (currentIndex > 0) {
                currentIndex--;
                this.updateRankImage(currentRankImage, rankImages[currentIndex], true);
            } else if (currentIndex === 0) {
                currentIndex = -1;  // Go back to no rank image displayed
                currentRankImage.setVisible(false);
            }
        });

        // Scroll down button functionality
        scrollDownButton.on('pointerdown', () => {
            if (currentIndex < rankImages.length - 1) {
                currentIndex++;
                this.updateRankImage(currentRankImage, rankImages[currentIndex], true);
            }
        });

        // Set up scrolling with the mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0 && currentIndex < rankImages.length - 1) {
                currentIndex++;
                this.updateRankImage(currentRankImage, rankImages[currentIndex], true);
            } else if (deltaY < 0 && currentIndex > 0) {
                currentIndex--;
                this.updateRankImage(currentRankImage, rankImages[currentIndex], true);
            } else if (deltaY < 0 && currentIndex === 0) {
                currentIndex = -1;  // Go back to no rank image displayed
                currentRankImage.setVisible(false);
            }
        });

        // Add main buttons (Play, Exit, etc.)
        const playButton = this.add.image(400, 1240, 'button_play2').setScale(0.8).setInteractive();
        const exitButton = this.add.image(600, 1240, 'button_exit').setScale(0.8).setInteractive();

        const shareOnXButton = this.add.image(512, 1450, 'ShareOnX').setScale(0.17).setInteractive();
        const inviteFriendsButton = this.add.image(512, 1580, 'InviteFriends').setScale(0.17).setInteractive();

        // Button interactions
        playButton.on('pointerdown', () => {
            console.log('Play Clicked');
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
    }

    // Function to update the rank image on screen and toggle visibility
    updateRankImage(currentImage, newImageKey, shouldShow) {
        currentImage.setTexture(newImageKey); // Swap texture of current image
        if (shouldShow) {
            currentImage.setVisible(true);  // Show the rank image
        }
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
