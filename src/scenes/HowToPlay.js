import { Scene } from 'phaser';
import { getUserBlobzBalance } from '../lobzTokenChecker.js';

export class HowToPlay extends Scene {
    constructor() {
        super('HowToPlay');
        this.typingText = '';
        this.fullText = 'Click on the falling coins \nto boost your score'; 
        this.textIndex = 0;
        this.userAddress = '';  // Initialize userAddress as an empty string
        this.tokenBalance = '';  // Initialize tokenBalance as an empty string
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
        // Background setup
        const howToPlayBg = this.add.image(0, 0, 'howToPlayBackground').setOrigin(0, 0);
        howToPlayBg.setScale(Math.max(this.sys.game.config.width / howToPlayBg.width, this.sys.game.config.height / howToPlayBg.height));

        // How to play section image (animation)
        const howToPlay = this.add.image(512, 400, 'howToPlay').setScale(0.2);
        this.tweens.add({
            targets: howToPlay,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const tapToWinText = this.add.text(500, 350, 'TAP TO WIN:', {
            fontFamily: 'AlteHaasGroteskBold',
            fontSize: '40px',
            color: '#8B4513',
            align: 'center'
        }).setOrigin(0.5);

        const instructionsText = this.add.text(500, 420, '', {
            fontFamily: 'AlteHaasGroteskRegular',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        this.typeText(instructionsText);

        // Add buttons (Play, Skip, Connect Wallet)
        this.createButtons();
        
        // Listen for wallet connection event
        document.addEventListener('walletConnected', (event) => {
            const { userAddress, tokenBalance } = event.detail;

            // Log connection success
            console.log('Wallet connected successfully:', userAddress);

            // Automatically start the ClickerGame scene upon successful connection
            this.scene.start('ClickerGame', { userAddress, tokenBalance });
        });
    }

    createButtons() {
        // Play button (remains for manual testing if needed)
        const playButton = this.add.image(350, 620, 'buttonPlay').setInteractive().setScale(0.6);
        playButton.on('pointerdown', () => {
            this.scene.start('ClickerGame');  // Start the clicker game scene
        });
        this.addHoverEffect(playButton);

        // Skip button (remains for manual testing if needed)
        const skipButton = this.add.image(650, 620, 'buttonSkip').setInteractive().setScale(0.6);
        skipButton.on('pointerdown', () => {
            this.scene.start('ClickerGame');  // Skip and start the clicker game scene
        });
        this.addHoverEffect(skipButton);

        // Connect Wallet button
        const centerX = this.cameras.main.width / 2;
        const connectWalletButton = this.add.image(centerX, 780, 'connectWallet').setInteractive().setScale(0.15);
        connectWalletButton.on('pointerdown', () => {
            getUserBlobzBalance();  // Trigger the MetaMask connection function
        });
        this.addHoverEffect(connectWalletButton);
    }
    
    addHoverEffect(button) {
        // When the mouse hovers, scale up slightly
        button.on('pointerover', () => {
            button.setScale(button.scaleX * 1.1);
        });

        // When the mouse leaves, revert to normal scale
        button.on('pointerout', () => {
            button.setScale(button.scaleX / 1.1);
        });
    }

    typeText(instructionsText) {
        // Type out text one character at a time with animation
        if (this.textIndex < this.fullText.length) {
            this.typingText += this.fullText[this.textIndex];
            instructionsText.setText(this.typingText);
            this.textIndex++;

            this.time.delayedCall(50, () => this.typeText(instructionsText));  // 50ms per character
        }
    }
}
