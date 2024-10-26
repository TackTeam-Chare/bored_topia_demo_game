export class Achievement extends Phaser.Scene {
    constructor() {
        super('Achievement');
    }

     // Use init to receive roomId
     init(data) {
        this.roomId = data.roomId || 'N/A'; // Store roomId with a default fallback
        console.log(`Achievement Scene started with Room ID: ${this.roomId}`);
    }

    preload() {
        this.load.image('BG', 'assets/ui/background/BG.png');
        this.load.image('Achievement', 'assets/ui/background/Achievement.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('ShareOnX', 'assets/ui/background/Share_on_X.png');
        this.load.image('button_play2', 'assets/ui/background/button_play2.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
    }

    async create() {
        // Set up the background
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);

        // Achievement animation
        const stars = this.add.image(512, 680, 'Achievement').setOrigin(0.5);
        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.25 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Add buttons
        const leaderBoardButton = this.add.image(440, 920, 'button_leaderboard').setScale(0.9).setInteractive();
        const playButton = this.add.image(590, 920, 'button_play2').setScale(0.9).setInteractive();
        const shareOnXButton = this.add.image(512, 1100, 'ShareOnX').setScale(0.18).setInteractive();
        const inviteFriendsButton = this.add.image(512, 1250, 'InviteFriends').setScale(0.18).setInteractive();

       playButton.on('pointerdown', () => {
            console.log('Play Clicked');
            this.scene.start('ClickerGame');
        });

        inviteFriendsButton.on('pointerdown', () => {
            console.log('Invite Friends Clicked');
            this.scene.start('InviteCodeScreen');
        });

        leaderBoardButton.on('pointerdown', () => {
            console.log('Leaderboard Clicked');
            this.scene.start('Leaderboard', { roomId: this.roomId });
        });

        shareOnXButton.on('pointerdown', () => {
            this.shareOnX();
        });
        

        this.addHoverEffect(playButton);
        this.addHoverEffect(leaderBoardButton);
        this.addHoverEffect(inviteFriendsButton);
        this.addHoverEffect(shareOnXButton);

        // Fetch and display user data
        const userAddress = await this.getUserAddress();
        if (userAddress) {
            await this.displayUserData(userAddress);
            await this.displayInviteCount(userAddress);
        } else {
            this.displayError('MetaMask not connected.');
        }

        // Typing effect text
        const bonusText = 'Invite friends to play. Both you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1400, bonusText, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            lineSpacing: 5,
        });

        // // Return to main menu on click
        // this.input.once('pointerdown', () => {
        //     this.registry.set('highscore', 0);
        //     this.scene.start('MainMenu');
        // });
    }

    async shareOnX() {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const userAddress = await this.getUserAddress();
            const response = await fetch(`${apiUrl}player-stats/${userAddress}`);

            if (!response.ok) throw new Error('Failed to fetch player data.');

            const { score, gamesPlayed } = await response.json();

            // Create a message for sharing
            const text = `I just scored ${score} points in BoredTopia! 🎮\nI've played ${gamesPlayed} games so far! 🚀\nJoin me and compete for rewards!\n#BoredTopia`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

            // Open Twitter share window
            const newWindow = window.open(tweetUrl, '_blank');
            if (newWindow) newWindow.focus();
        } catch (error) {
            console.error('Error sharing on X:', error);
        }
    }


    async displayInviteCount(userAddress) {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}invites-count/${userAddress}`);

            if (!response.ok) {
                throw new Error('Failed to fetch invite count');
            }

            const { inviteCount } = await response.json();

            this.add.text(540, 765, `${inviteCount}`, {
                fontFamily: 'Arial Black',
                fontSize: '28px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
            }).setOrigin(0.5);
        } catch (error) {
            console.error('Error fetching invite count:', error);
            this.displayError('Error fetching invite count.');
        }
    }

    async getUserAddress() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                return await signer.getAddress();
            } catch (error) {
                console.error('MetaMask login failed:', error);
                return null;
            }
        } else {
            console.log('MetaMask not detected');
            return null;
        }
    }

    async displayUserData(userAddress) {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}player-stats/${userAddress}`);

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const { score, gamesPlayed, userAddress: address } = await response.json();
            const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

            this.add.text(565, 585, `${shortAddress}`, {
                fontFamily: 'Arial Black',
                fontSize: '30px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
            }).setOrigin(0.5);

            this.add.text(540, 645, `${score}`, {
                fontFamily: 'Arial Black',
                fontSize: '30px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
            }).setOrigin(0.5);

            this.add.text(540, 705, `${gamesPlayed}`, {
                fontFamily: 'Arial Black',
                fontSize: '30px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
            }).setOrigin(0.5);

        } catch (error) {
            console.error('Error fetching user data:', error);
            this.displayError('Error fetching user data.');
        }
    }

    displayError(message) {
        this.add.text(512, 384, message, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FF0000',
        }).setOrigin(0.5);
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    addTypingEffect(x, y, text, style) {
        const textObject = this.add.text(x, y, '', style).setOrigin(0.5);
        let index = 0;

        this.time.addEvent({
            delay: 50,
            callback: () => {
                textObject.text += text[index];
                index++;
                if (index >= text.length) {
                    this.time.removeAllEvents();
                }
            },
            repeat: text.length - 1,
        });
    }
}