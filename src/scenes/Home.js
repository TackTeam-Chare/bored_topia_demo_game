import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('logo', 'assets/ui/logo.png');
        this.load.image('Start', 'assets/ui/background/Start.svg');
        this.load.image('Load_1', 'assets/ui/background/Load_1.svg');
        this.load.image('Load_2', 'assets/ui/background/Load_2.svg');
        this.load.image('Load_3', 'assets/ui/background/Load_3.svg');
        this.load.image('OpeningPage', 'assets/ui/background/OpeningPage.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'OpeningPage').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        const logo = this.add.image(this.scale.width / 2, 350, 'logo').setScale(0.3);
        this.tweens.add({
            targets: logo,
            y: 290,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startButton = this.add.image(this.scale.width / 2, this.scale.height * 0.85, 'Start')
            .setInteractive()
            .setScale(1.5);

        startButton.on('pointerdown', async () => {
            const userAddress = await this.checkMetaMaskLogin();

            if (userAddress) {
                this.assignRoomAndStartGame(userAddress);
            } else {
                this.scene.start('HowToPlay');
            }
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
        try {
            const response = await fetch('http://localhost:3000/assign-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userAddress })
            });

            const data = await response.json();
            console.log('Assigned Room:', data.roomId);

            this.scene.start('ClickerGame', {
                userAddress: userAddress,
                roomId: data.roomId
            });
        } catch (error) {
            console.error('Error assigning room:', error);
        }
    }
}
