export class HallOfFame extends Phaser.Scene { 
    constructor() {
        super('HallOfFame');
        this.hallOfFameData = [];  // Store Hall of Fame data
        this.currentPage = 0;      // Current page being viewed
        this.pageSize = 12;        // Number of players per page
        this.playerTexts = [];     // Store displayed player texts
        this.rankImages = ['1-12', '13-24', '25-36', '37-48'];
    }
    init(data) {
        // รับ roomId จาก Scene ก่อนหน้า
        this.roomId = data.roomId || 'N/A';
        console.log(`Received roomId: ${this.roomId} from Leaderboard`);

        if (this.roomId === 'N/A') {
            console.error('Room ID not available.');
        } else {
            this.fetchHallOfFameData(); // เรียกข้อมูล Hall of Fame
        }
    }

    fetchHallOfFameData() {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        fetch(`${apiUrl}hall-of-fame/${this.roomId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            this.hallOfFameData = data;
            console.log('Fetched Hall of Fame Data:', data);
            this.displayPlayersForCurrentPage(); // แสดงข้อมูล
        })
        .catch(error => console.error('Error fetching Hall of Fame data:', error));
    
    }
    
    preload() {
        // Load background and UI elements
        this.load.image('BG', 'assets/ui/background/BG.png');
        this.load.image('Hall_of_fame', 'assets/ui/background/Hall_of_fame.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('ShareOnX', 'assets/ui/background/Share_on_X.png');
        this.load.image('button_play2', 'assets/ui/background/button_play2.svg');
        this.load.image('scrollArrow', 'assets/ui/background/button_scroll_arrow.svg');
        this.load.image('scrollBar', 'assets/ui/background/button_scroll_bar.svg');

        // Load rank images
        // biome-ignore lint/complexity/noForEach: <explanation>
                this.rankImages.forEach(img => {
            this.load.image(img, `assets/ui/background/${img}.png`);
        });
    }

    create() {
        // Set up the background
        this.add.image(512, 384, 'BG').setOrigin(0.5);
        this.add.image(512, 700, 'Hall_of_fame').setOrigin(0.5).setScale(0.45);

        // Initialize the rank image
        this.currentRankImage = this.add.image(475, 685, this.rankImages[0])
            .setOrigin(0.5)
            .setScale(0.45)
            .setVisible(true);

        // Scroll Bar and Arrows
        const scrollBar = this.add.image(780, 620, 'scrollBar').setScale(5, 5);

        const scrollUpButton = this.add.image(
            scrollBar.x, 
            scrollBar.y - scrollBar.displayHeight / 2, 
            'scrollArrow'
        ).setScale(0.4).setInteractive();

        const scrollDownButton = this.add.image(
            scrollBar.x, 
            scrollBar.y + scrollBar.displayHeight / 2, 
            'scrollArrow'
        ).setScale(0.4).setInteractive().setFlipY(true);

        // Add hover effects to scroll buttons
        this.addHoverEffect(scrollUpButton, 'Scroll Up Hovered');
        this.addHoverEffect(scrollDownButton, 'Scroll Down Hovered');

        // Scroll button functionality
        scrollUpButton.on('pointerdown', () => this.scrollUp());
        scrollDownButton.on('pointerdown', () => this.scrollDown());

        // Scroll wheel support
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0) this.scrollDown();
            if (deltaY < 0) this.scrollUp();
        });

        // Play and Exit buttons
        const playButton = this.add.image(512, 1300, 'button_play2').setScale(0.9).setInteractive();

        const shareOnXButton = this.add.image(512, 1450, 'ShareOnX').setScale(0.17).setInteractive();
        const inviteFriendsButton = this.add.image(512, 1600, 'InviteFriends').setScale(0.17).setInteractive();

        playButton.on('pointerdown', () => {
            console.log('Play Clicked');
            this.scene.start('ClickerGame');
        });

        inviteFriendsButton.on('pointerdown', () => {
            console.log('Invite Friends Clicked');
            this.scene.start('InviteCodeScreen', {
                userAddress: userAddress,
            });
        });

        shareOnXButton.on('pointerdown', () => this.shareOnX());

        this.addHoverEffect(playButton, 'Play Button Hovered');
        this.addHoverEffect(shareOnXButton, 'ShareOnX Button Hovered');
        this.addHoverEffect(inviteFriendsButton);
        
        // Typing effect for bonus text
        const bonusText = 'Invite friends to play.\nBoth you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1720, bonusText, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            lineSpacing: 5
        });

        // Fetch and display Hall of Fame data
        this.fetchHallOfFameData();
    }

    async shareOnX() {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const userAddress = await this.getUserAddress();
            const response = await fetch(`${apiUrl}player-stats/${userAddress}`);

            if (!response.ok) throw new Error('Failed to fetch player data.');

            const { score, gamesPlayed } = await response.json();
            const text = `I just scored ${score} points in BoredTopia! 🎮\nI've played ${gamesPlayed} games! 🚀\nJoin me on BoredTopia and compete for rewards!\n#BoredTopia`;
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

            const newWindow = window.open(tweetUrl, '_blank');
            if (newWindow) newWindow.focus();
        } catch (error) {
            console.error('Error sharing on X:', error);
        }
    }


    async getUserAddress() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return await signer.getAddress();
        } catch (error) {
            console.error('MetaMask login failed:', error);
            return null;
        }
    }

    // Scroll up functionality
    scrollUp() {
        if (this.currentPage > 0) {
            console.log('Scroll Up Clicked');
            this.currentPage--;
            this.updateRankImage();
            this.displayPlayersForCurrentPage();
        }
    }

    // Scroll down functionality
    scrollDown() {
        const totalPages = Math.ceil(this.hallOfFameData.length / this.pageSize);
        if (this.currentPage < totalPages - 1) {
            console.log('Scroll Down Clicked');
            this.currentPage++;
            this.updateRankImage();
            this.displayPlayersForCurrentPage();
        }
    }

    // Update rank image
    updateRankImage() {
        const rankImageKey = this.rankImages[this.currentPage];
        this.currentRankImage.setTexture(rankImageKey).setVisible(true);
        console.log(`Updated Rank Image: ${rankImageKey}`);
    }


    // Display players for the current page
    displayPlayersForCurrentPage() {
        const textStyle = { fontSize: '32px', color: '#ffffff', fontFamily: 'Arial Black',fill: '#fff' };
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.hallOfFameData.length);

        // Disable scroll buttons if less than 12 players
        const totalPlayers = this.hallOfFameData.length;
        if (totalPlayers < 12) {
            console.log('Less than 12 players, disabling scroll buttons');
        }

        // Clear previous player display
        this.clearPlayerDisplay();

        let yPos = 230;
        for (let i = startIndex; i < endIndex; i++) {
            const player = this.hallOfFameData[i];
            const shortAddress = `${player.userAddress.slice(0, 4)}${player.userAddress.slice(-4)}`;
            const playerText = this.add.text(290, yPos, `${shortAddress}         ${player.score}`, textStyle);
            this.playerTexts.push(playerText);
            console.log(`${shortAddress}        ${player.score}`);
            yPos += 80;
        }
    }

    // Clear previous player display
    clearPlayerDisplay() {
        // biome-ignore lint/complexity/noForEach: <explanation>
        this.playerTexts.forEach(text => text.destroy());
        this.playerTexts = [];
    }

    // Add hover effect to buttons with console logging
    addHoverEffect(button, message) {
        button.on('pointerover', () => {
            button.setScale(button.scaleX * 1.1);
            console.log(message);
        });
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    // Typing effect for bonus text
    addTypingEffect(x, y, text, style) {
        const textObject = this.add.text(x, y, '', style).setOrigin(0.5);
        let index = 0;

        this.time.addEvent({
            delay: 50,
            callback: () => {
                textObject.text += text[index];
                index++;
                if (index >= text.length) this.time.removeAllEvents();
            },
            repeat: text.length - 1
        });
    }
}