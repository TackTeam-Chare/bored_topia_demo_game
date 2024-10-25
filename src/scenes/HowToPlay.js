import { Scene } from 'phaser';
import { getUserBlobzBalance } from '../lobzTokenChecker.js';

export class HowToPlay extends Scene {
    constructor() {
        super('HowToPlay');
        this.instructions = [
            "1. Tap to win: Click on the falling coins to boost your score.",
            "2. Dodge the skulls: Avoid the spooky skulls to keep your points safe.",
            "3. Join the party: Compete against 10 other players in each room.",
            "4. Become the Giver: Share your score with others if you're the 6th highest scorer.",
            "5. Unlock the bonus: Share your invite to get a 50% bonus on your friend’s scores.",
            "6. Climb the leaderboard: Aim for the top spot!"
        ];
        this.instructionImages = ['Tap', 'Dodge', 'Join', 'Become', 'Unlock', 'Climb'];
        this.currentInstructionIndex = 0;
        this.currentImage = null; // Track the current displayed image
        this.typingText = '';
        this.userAddress = '';
        this.tokenBalance = '';
        this.roomId = null;
        this.isTrialMode = true;
        this.isImageMode = false; // Track if images are being displayed
    }

    preload() {
        // Preload background and UI assets
        this.load.image('howToPlayBackground', 'assets/ui/background/HowToPlayPage.png');
        this.load.image('howToPlay', 'assets/ui/background/HowToPlay.png');
        this.load.image('connectWallet', 'assets/ui/background/Connect_wallet.png');
        this.load.image('buttonPlay', 'assets/ui/background/button_play.svg');
        this.load.image('buttonSkip', 'assets/ui/background/button_skip.svg');

        // Preload all instruction images to prevent delays
        this.instructionImages.forEach(image => {
            this.load.image(image, `assets/ui/background/${image}.svg`);
        });
    }

    create() {
        // Set up the background
        const howToPlayBg = this.add.image(0, 0, 'howToPlayBackground').setOrigin(0, 0);
        howToPlayBg.setScale(Math.max(
            this.sys.game.config.width / howToPlayBg.width,
            this.sys.game.config.height / howToPlayBg.height
        ));

        // Add the title with animation
        const howToPlayTitle = this.add.image(512, 400, 'howToPlay').setScale(0.2);
        this.tweens.add({
            targets: howToPlayTitle,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add instructions text
        this.instructionsText = this.add.text(512, 400, '', {
            fontFamily: 'AlteHaasGroteskRegular',
            fontSize: '36px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true },
            lineSpacing: 15
        }).setOrigin(0.5);

        this.createButtons(); // Create Play, Skip, and Wallet buttons
        this.typeText(this.instructionsText); // Start typing instructions

        document.addEventListener('walletConnected', async (event) => {
            const { userAddress, tokenBalance } = event.detail;
            this.userAddress = userAddress;
            this.tokenBalance = tokenBalance;
            this.isTrialMode = false;

            const isNewUser = await this.checkIfNewUser(userAddress);
            if (isNewUser) {
                this.scene.start('InviteCodeScreen');
            } else {
                await this.assignRoom();
                this.startGame();
            }
        });
    }

    typeText(instructionsText) {
        const currentInstruction = this.instructions[this.currentInstructionIndex];

        if (this.typingText.length < currentInstruction.length) {
            this.typingText += currentInstruction[this.typingText.length];
            instructionsText.setText(this.typingText);
            this.time.delayedCall(50, () => this.typeText(instructionsText));
        } else {
            this.time.delayedCall(1000, () => this.nextInstruction(instructionsText));
        }
    }

    nextInstruction(instructionsText) {
        this.currentInstructionIndex++;
        if (this.currentInstructionIndex < this.instructions.length) {
            this.typingText = '';
            this.typeText(instructionsText);
        } else {
            this.currentInstructionIndex = 0; // Reset index if all instructions are shown
        }
    }

    createButtons() {
        const playButton = this.add.image(350, 620, 'buttonPlay').setInteractive().setScale(0.6);
        playButton.on('pointerdown', () => {
            this.isImageMode = true; // Activate image mode
            this.instructionsText.setVisible(false); // Hide instructions
            this.showNextImage(); // Display the first image
        });
        this.addHoverEffect(playButton);

        const skipButton = this.add.image(650, 620, 'buttonSkip').setInteractive().setScale(0.6);
        skipButton.on('pointerdown', () => {
            this.startGame(); // Skip to the game
        });
        this.addHoverEffect(skipButton);

        const connectWalletButton = this.add.image(this.cameras.main.width / 2, 780, 'connectWallet')
            .setInteractive()
            .setScale(0.15);
        connectWalletButton.on('pointerdown', () => getUserBlobzBalance());
        this.addHoverEffect(connectWalletButton);
    }

    showNextImage() {
        // Remove any currently displayed image
        if (this.currentImage) this.currentImage.destroy();

        if (this.currentInstructionIndex < this.instructionImages.length) {
            const imageName = this.instructionImages[this.currentInstructionIndex];
            this.currentImage = this.add.image(512, 400, imageName).setScale(1.3).setOrigin(0.5);

            this.currentImage.setInteractive();
            this.currentImage.on('pointerdown', () => {
                this.currentInstructionIndex++;
                this.showNextImage(); // Load the next image immediately
            });
        } else {
            console.log('All images displayed. Starting game...');
            this.startGame(); // Start game after the last image
        }
    }

    async checkIfNewUser(userAddress) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        try {
            const response = await fetch(`${apiUrl}check-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress })
            });

            const data = await response.json();
            return data.isNewUser;
        } catch (error) {
            console.error('Error checking user:', error);
            return false;
        }
    }

    async assignRoom() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}assign-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress: this.userAddress })
            });

            const data = await response.json();
            this.roomId = data.roomId;
            console.log(`Assigned to Room ID: ${this.roomId}`);
        } catch (error) {
            console.error('Error assigning room:', error);
        }
    }

    startGame() {
        console.log(`Starting game with Room ID: ${this.roomId}`);
        this.scene.start('ClickerGame', {
            userAddress: this.userAddress,
            tokenBalance: this.tokenBalance,
            roomId: this.roomId,
            isTrialMode: this.isTrialMode
        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }
}
