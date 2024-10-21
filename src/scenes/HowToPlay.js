import { Scene } from 'phaser';
import { getUserBlobzBalance } from '../lobzTokenChecker.js';

export class HowToPlay extends Scene {
    constructor() {
        super('HowToPlay');
        this.typingText = '';
        this.instructions = [
            "1. Tap to win: Click on the falling coins to boost your score.",
            "2. Dodge the skulls: Avoid the spooky skulls to keep your points safe.",
            "3. Join the party: Compete against 10 other players in each room.",
            "4. Become the Giver: If you're the 6th highest scorer at the end of the round, you'll share your score with others.",
            "5. Unlock the bonus: Share your invite link to get a 50% bonus on your friend’s first round scores.",
            "6. Climb the leaderboard: Aim for the top spot and compete against others!"
        ];
        this.currentInstructionIndex = 0;
        this.textIndex = 0;
        this.userAddress = '';
        this.tokenBalance = '';
        this.roomId = null;
        this.isTrialMode = true; // Start in trial mode by default
    }

    preload() {
        this.load.image('howToPlayBackground', 'assets/ui/background/HowToPlayPage.png');
        this.load.image('howToPlay', 'assets/ui/background/HowToPlay.png');
        this.load.image('connectWallet', 'assets/ui/background/Connect_wallet.png');
        this.load.image('buttonPlay', 'assets/ui/background/button_play.svg');
        this.load.image('buttonSkip', 'assets/ui/background/button_skip.svg');
        this.load.css('fonts', 'assets/fonts/AlteHaasGroteskBold.ttf');
        this.load.css('fonts', 'assets/fonts/AlteHaasGroteskRegular.ttf');
    }

    create() {
        const howToPlayBg = this.add.image(0, 0, 'howToPlayBackground').setOrigin(0, 0);
        howToPlayBg.setScale(Math.max(
            this.sys.game.config.width / howToPlayBg.width,
            this.sys.game.config.height / howToPlayBg.height
        ));

        const howToPlay = this.add.image(512, 400, 'howToPlay').setScale(0.2);
        this.tweens.add({
            targets: howToPlay,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const instructionsText = this.add.text(512, 400, '', {
            fontFamily: 'AlteHaasGroteskRegular',
            fontSize: '36px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true }, 
            lineSpacing: 15 
        }).setOrigin(0.5);

        this.typeText(instructionsText); // Start typing the first instruction

        this.createButtons();

        document.addEventListener('walletConnected', async (event) => {
            const { userAddress, tokenBalance } = event.detail;

            this.userAddress = userAddress;
            this.tokenBalance = tokenBalance;
            this.isTrialMode = false;

            console.log(`Wallet connected: ${userAddress}, Balance: ${tokenBalance}`);
            this.registry.set('userAddress', userAddress);
            this.registry.set('tokenBalance', tokenBalance);

            await this.assignRoom();
            this.startGame();
        });
    }

    typeText(instructionsText) {
        const currentInstruction = this.instructions[this.currentInstructionIndex];

        if (this.textIndex < currentInstruction.length) {
            this.typingText += currentInstruction[this.textIndex];
            instructionsText.setText(this.typingText);
            this.textIndex++;
            this.time.delayedCall(50, () => this.typeText(instructionsText));
        } else {
            this.time.delayedCall(1000, () => this.nextInstruction(instructionsText));
        }
    }

    nextInstruction(instructionsText) {
        this.currentInstructionIndex++;
        if (this.currentInstructionIndex < this.instructions.length) {
            this.typingText = '';
            this.textIndex = 0;
            this.typeText(instructionsText);
        }
    }

    createButtons() {
        const playButton = this.add.image(350, 620, 'buttonPlay').setInteractive().setScale(0.6);
        playButton.on('pointerdown', () => {
            if (!this.isTrialMode && !this.roomId) {
                console.error('Room not assigned yet.');
            } else {
                this.startGame();
            }
        });
        this.addHoverEffect(playButton);

        const skipButton = this.add.image(650, 620, 'buttonSkip').setInteractive().setScale(0.6);
        skipButton.on('pointerdown', () => {
            console.log('Starting trial mode without login...');
            this.isTrialMode = true;
            this.startGame();
        });
        this.addHoverEffect(skipButton);

        const connectWalletButton = this.add.image(this.cameras.main.width / 2, 780, 'connectWallet').setInteractive().setScale(0.15);
        connectWalletButton.on('pointerdown', () => {
            getUserBlobzBalance();
        });
        this.addHoverEffect(connectWalletButton);
    }

    async assignRoom() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}assign-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userAddress: this.userAddress })
            });

            const data = await response.json();
            if (response.ok) {
                this.roomId = data.roomId;
                console.log(`Assigned to Room ID: ${this.roomId}`);
            } else {
                console.error('Failed to assign room:', data);
            }
        } catch (error) {
            console.error('Error assigning room:', error);
        }
    }

    startGame() {
        console.log(`Starting game with Room ID: ${this.roomId}`);
        this.scene.start('ClickerGame', {
            userAddress: this.userAddress || '',
            tokenBalance: this.tokenBalance || 0,
            roomId: this.roomId,
            isTrialMode: this.isTrialMode
        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }
}
