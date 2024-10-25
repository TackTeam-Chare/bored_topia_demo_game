import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        // Load assets
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('Start', 'assets/ui/background/Start.svg');
        this.load.image('Load_1', 'assets/ui/background/Load_1.svg');
        this.load.image('Load_2', 'assets/ui/background/Load_2.svg');
        this.load.image('Load_3', 'assets/ui/background/Load_3.svg');
        this.load.image('OpeningPage', 'assets/ui/background/OpeningPage.png');
    }

    create() {
        // Set up background
        const bg = this.add.image(0, 0, 'OpeningPage').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // Add logo with animation
        const logo = this.add.image(this.scale.width / 2, 350, 'logo').setScale(0.3);
        this.tweens.add({
            targets: logo,
            y: 290,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add Start button with interactivity
        const startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.85, 'Start')
            .setInteractive()
            .setScale(1.5);

        // Handle button hover effects
        startButton.on('pointerover', () => startButton.setScale(1.6));
        startButton.on('pointerout', () => startButton.setScale(1.5));

        // Handle button click to start loading animation
        startButton.on('pointerdown', async () => {
            startButton.destroy();  // Hide button after click
            await this.showLoadingAnimation();  // Run loading sequence

            const userAddress = await this.checkMetaMaskLogin();
            if (userAddress) {
                await this.assignRoomAndStartGame(userAddress);
            } else {
                this.scene.start('HowToPlay');  // Redirect if MetaMask login fails
            }
        });

        // Adjust UI on window resize
        this.scale.on('resize', this.resize, this);
    }

    resize() {
        // Ensure elements adjust on resize
        const startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.85, 'Start');
        startButton.setScale(1.5);
    }

    async showLoadingAnimation() {
        // Initialize loading at the Start button's position
        const loadImage = this.add.image(this.scale.width / 2, this.scale.height * 0.85, 'Load_1').setScale(2.5);

        // Loop through Load_1, Load_2, and Load_3
        for (let i = 1; i <= 3; i++) {
            loadImage.setTexture(`Load_${i}`);  // Update texture
            await this.wait(1000);  // Wait 1 second for each image
        }

        loadImage.destroy();  // Remove loading image after sequence completes
    }

    // Helper function to create a delay
    wait(ms) {
        return new Promise(resolve => {
            this.time.addEvent({ delay: ms, callback: resolve });
        });
    }

    async checkMetaMaskLogin() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                return userAddress;
            } catch (error) {
                console.error('MetaMask login failed:', error);
            }
        } else {
            console.log('MetaMask not detected');
        }
        return null;
    }

    async assignRoomAndStartGame(userAddress) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        try {
            const response = await fetch(`${apiUrl}assign-room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userAddress })
            });

            const data = await response.json();
            console.log('Assigned Room:', data.roomId);

            // Start the ClickerGame scene with user details
            this.scene.start('ClickerGame', {
                userAddress: userAddress,
                roomId: data.roomId
            });
        } catch (error) {
            console.error('Error assigning room:', error);
        }
    }
}