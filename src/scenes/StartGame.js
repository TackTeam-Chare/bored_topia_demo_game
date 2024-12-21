import {
    Scene
} from 'phaser';
import {
    Noise
} from 'noisejs';

export class ClickerGame extends Scene {
    constructor() {
        super('ClickerGame');
        this.noise = new Noise(Math.random());
        this.noiseOffset = 0;
        this.isGameOver = false; // State to check if the game is over
        this.soundOn = true; // Variable to track sound state
    }

    init(data) {
        this.userAddress = data.userAddress || '';
        this.tokenBalance = data.tokenBalance || 0;
        this.roomId = data.roomId || 'N/A'; // Default to a non-N/A ID
        console.log(`Game started with Room ID: ${this.roomId}`);
    }
    

    preload() {
        this.load.audio('coin_Bonze', 'assets/sounds/coin_Bonze.mp3');
        this.load.audio('coin_Gold_X', 'assets/sounds/coin_Gold_X.mp3');
        this.load.audio('coin_Gold', 'assets/sounds/coin_Gold.mp3');
        this.load.audio('coin_Silver', 'assets/sounds/coin_Silver.mp3');
        this.load.image('wallet', 'assets/ui/background/wallet.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_setting', 'assets/ui/background/button_setting.svg');
        this.load.image('button_sound_on', 'assets/ui/background/button_sound_on.svg');
        this.load.image('button_sound_off', 'assets/ui/background/button_sound_off.svg');
        this.load.image('play_button', 'assets/ui/background/Play.png');
        this.load.image('monster', 'assets/ui/background/monster.png');
    }

    create() {
        // Reset score when starting the game
        this.registry.set('highscore', 0);
        this.score = 0;
        this.coins = [];
        this.isGameOver = false; // Start as false
    
        const bg = this.add.image(0, 0, 'PlayPage').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
    
        const coinDispenser = this.add.image(512, 330, 'CoinDispenser').setScale(0.15);
    
        this.tweens.add({
            targets: coinDispenser,
            y: 170,
            ease: 'Power1',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    
        // Position the wallet, score, and time icons
        const topMargin = 30;
        const timeBg = this.add.image(140, 200 + topMargin, 'Clock').setDisplaySize(240, 75).setAlpha(1);
        const scoreBg = this.add.image(850, 200 + topMargin, 'Score').setDisplaySize(230, 75).setAlpha(1);
        const walletIcon = this.add.image(850, 80 + topMargin, 'wallet').setDisplaySize(240, 95).setAlpha(1);
        const monster = this.add.image(775, 80 + topMargin, 'monster').setDisplaySize(110, 110).setAlpha(1).setInteractive();
    
        const textStyle = {
            fontFamily: 'Arial Black',
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        };
    
        const shortAddress = `${this.userAddress.slice(0, 4)}${this.userAddress.slice(-4)}`;
        this.add.text(walletIcon.x + 40, walletIcon.y + 15, ` ${shortAddress}`, textStyle).setOrigin(0.5, 0.5);
    
        this.scoreText = this.add.text(scoreBg.x + 30, scoreBg.y, '0', textStyle).setOrigin(0.5).setDepth(1);
        this.timeText = this.add.text(timeBg.x, timeBg.y, '10', textStyle).setOrigin(0.3).setDepth(1);
    
        // Play button and rearranged buttons
        const playButton = this.add.image(512, 1600, 'play_button').setInteractive().setScale(0.25);
    
        // Button configuration
        const buttonScale = 0.65;
        const buttonY = playButton.y + 40; // Adjust the Y-position to move them higher
        const buttonSpacing = 120; // Adjust for even spacing between buttons
    
        // Calculate the starting X position to center-align all three buttons
        const totalWidth = 2 * buttonSpacing; // Total width occupied by all buttons (since there are three)
        const startX = playButton.x - totalWidth / 2; // Center alignment calculation
    
        // Create the buttons and position them accordingly
        const leaderboardButton = this.add.image(
            startX, buttonY, 'button_leaderboard'
        ).setScale(buttonScale).setInteractive();
    
        const soundButton = this.add.image(
            startX + buttonSpacing, buttonY, 'button_sound_on'
        ).setScale(buttonScale).setInteractive();
    
        const settingButton = this.add.image(
            startX + 2 * buttonSpacing, buttonY, 'button_setting'
        ).setScale(buttonScale).setInteractive();
    
        // Add hover effects for all buttons
        this.addHoverEffect(leaderboardButton);
        this.addHoverEffect(soundButton);
        this.addHoverEffect(settingButton);
        this.addHoverEffect(monster);

        // Sound Button Toggle
        soundButton.on('pointerdown', () => {
            this.soundOn = !this.soundOn;
            soundButton.setTexture(this.soundOn ? 'button_sound_on' : 'button_sound_off');
        });
        
        monster.on('pointerdown', () => {
            console.log('Navigating to Achievement Scene with Room ID:', this.roomId);
            this.scene.start('Achievement', { roomId: this.roomId });
        });
        

        // Leaderboard Button Action
        leaderboardButton.on('pointerdown', () => {
            this.scene.start('Leaderboard', { roomId: this.roomId });
            console.log('Open Leaderboard');
        });
    
        // Settings Button Action
        settingButton.on('pointerdown', () => {
            console.log('Open Settings');
        });
    
        // Set the world bounds to the entire visible screen
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    
        // Timer initialization (ensure it's set correctly)
        this.timer = this.time.addEvent({
            delay: 60000,
            callback: () => this.gameOver() // End the game after 15 seconds
        });
    
        this.scheduleNextCoinDrop();
    
        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));
    }
    


    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.2));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.2));
    }

    scheduleNextCoinDrop() {
        const delay = Phaser.Math.Between(500, 3000);
        this.time.delayedCall(delay, () => {
            if (!this.isGameOver) {
                const coinCount = Phaser.Math.Between(1, 10);
                for (let i = 0; i < coinCount; i++) {
                    this.dropCoin();
                }
                this.scheduleNextCoinDrop();
            }
        });
    }

    dropCoin() {
        if (this.isGameOver) return;

    const dispenserX = this.scale.width / 2; // ตำแหน่งตรงกลางจอ
    const dispenserY = this.scale.height * 0.3; // ปรับตามสัดส่วนจอ

    const x = dispenserX + Phaser.Math.Between(-50, 50);
    const y = dispenserY + Phaser.Math.Between(-20, 20);
        const coinTypes = [{
                key: 'coinBonze',
                rotateAnim: 'Bonze_rotate',
                vanishAnim: 'Bonze_vanish',
                score: 1,
                weight: 50
            },
            {
                key: 'coinSilver',
                rotateAnim: 'Silver_rotate',
                vanishAnim: 'Silver_vanish',
                score: 2,
                weight: 30
            },
            {
                key: 'coinGoldx2',
                rotateAnim: 'Goldx2_rotate',
                vanishAnim: 'Goldx2_vanish',
                score: 10,
                weight: 20
            },
            {
                key: 'coinGoldx3',
                rotateAnim: 'Goldx3_rotate',
                vanishAnim: 'Goldx3_vanish',
                score: 30,
                weight: 10
            },
            {
                key: 'coinGoldx4',
                rotateAnim: 'Goldx4_rotate',
                vanishAnim: 'Goldx4_vanish',
                score: 50,
                weight: 5
            },
            {
                key: 'coinGoldx5',
                rotateAnim: 'Goldx5_rotate',
                vanishAnim: 'Goldx5_vanish',
                score: 100,
                weight: 2
            }
        ];

        const randomCoinType = this.weightedRandom(coinTypes);
        const coin = this.physics.add.sprite(x, y, randomCoinType.key).play(randomCoinType.rotateAnim);

      
        
         // ปรับขนาดเหรียญให้เหมาะสมกับหน้าจอ
        const coinScale = this.scale.width < 768 ? 2.5 : 1.9; // ถ้าหน้าจอแคบให้ขนาดใหญ่ขึ้น
        coin.setScale(coinScale);

    // เพิ่ม Hit Area สำหรับมือถือ
         coin.setInteractive({ useHandCursor: true, hitArea: new Phaser.Geom.Circle(0, 0, 60) });
        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.Between(200, 400);

        const velocityX = speed * Math.cos(Phaser.Math.DegToRad(angle));
        const velocityY = Phaser.Math.Between(300, 400);

        coin.body.setVelocity(velocityX, velocityY);
        coin.setCollideWorldBounds(true);
        coin.setBounce(0);

        coin.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === coin && body.blocked.down) {
                coin.destroy();
            }
        });

        this.time.delayedCall(100, () => {
            coin.setInteractive();
        });

        coin.coinType = randomCoinType;
        this.coins.push(coin);
    }

    weightedRandom(coinTypes) {
        const totalWeight = coinTypes.reduce((acc, coin) => acc + coin.weight, 0);
        let random = Phaser.Math.Between(0, totalWeight);

        for (let i = 0; i < coinTypes.length; i++) {
            if (random < coinTypes[i].weight) {
                return coinTypes[i];
            }
            random -= coinTypes[i].weight;
        }
        return coinTypes[0];
    }

    clickCoin(coin) {
        if (this.isGameOver || !coin || !coin.body) return; // Ensure the coin and its physics body exist

        coin.disableInteractive();
        coin.body.setVelocity(0, 0); // Ensure the body exists before setting velocity
        coin.play(coin.coinType.vanishAnim);

        // Play sound only if sound is on
        if (this.soundOn) {
            switch (coin.coinType.key) {
                case 'coinBonze':
                    this.sound.play('coin_Bonze');
                    break;
                case 'coinSilver':
                    this.sound.play('coin_Silver');
                    break;
                case 'coinGoldx2':
                case 'coinGoldx3':
                case 'coinGoldx4':
                case 'coinGoldx5':
                    this.sound.play('coin_Gold_X');
                    break;
                default:
                    this.sound.play('coin_Gold');
            }
        }

        // Applying the score multiplier based on the tokenBalance
        let scoreMultiplier = 1;
        if (this.tokenBalance && parseFloat(this.tokenBalance) > 0) {
            scoreMultiplier = parseFloat(this.tokenBalance); // Use tokenBalance as a multiplier
        }

        // Calculate final score by applying tokenBalance and existing score multiplier
        const finalScore = coin.coinType.score * scoreMultiplier;

        // Display the final score on the screen
        const scoreText = this.add.text(coin.x, coin.y, `+${finalScore}`, {
            fontFamily: 'Arial Black',
            fontSize: '40px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Animate the score display
        this.tweens.add({
            targets: scoreText,
            y: coin.y - 50,
            alpha: 0,
            scale: {
                from: 1,
                to: 1.5
            },
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => scoreText.destroy()
        });

        coin.once('animationcomplete-' + coin.coinType.vanishAnim, () => coin.destroy());

        // Add the calculated final score to the overall game score
        this.score += finalScore;
        this.scoreText.setText(this.score.toString());

        // Drop the next coin
        this.dropCoin();
    }



    update() {
        if (this.timer) {
            const remainingTime = Math.ceil(this.timer.getRemainingSeconds());
            const hours = Math.floor(remainingTime / 3600);
            const minutes = Math.floor((remainingTime % 3600) / 60);
            const seconds = remainingTime % 60;

            const formattedTime = this.formatTime(hours, minutes, seconds);
            this.timeText.setText(formattedTime);
        }
    }

    formatTime(hours, minutes, seconds) {
        const pad = (num) => (num < 10 ? '0' : '') + num;
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    gameOver() {
        this.isGameOver = true;
        console.log(`Game over. Final score: ${this.score}, Room ID: ${this.roomId}`);
        this.coins.forEach(coin => {
            if (coin.active) {
                coin.body.setVelocity(0, 0); // Fix the velocity method
                coin.play(coin.coinType.vanishAnim);
            }
        });

        this.input.off('gameobjectdown');
        const highscore = this.registry.get('highscore');
        if (this.score > highscore) {
            this.registry.set('highscore', this.score);
        }

        // Check if the user is logged in with MetaMask, submit score only if logged in
        if (this.userAddress) {
            this.submitScore();
        } else {
            console.log('Trial mode: Score not submitted.');
        }
        // this.registry.set('highscore', this.score);
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver', {
                score: this.score,
                roomId: this.roomId // Ensure roomId is passed
            });
            
        });
    }

    async submitScore() {
        const userAddress = this.registry.get('userAddress') || this.userAddress;
        const score = this.registry.get('highscore') || this.score;
        const tokenBalance = this.tokenBalance !== undefined ? this.tokenBalance : 0;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
        // ตรวจสอบว่า userAddress ถูกต้อง
        if (!userAddress) {
            console.log('User not logged in, score not submitted.');
            alert('You need to log in before submitting a score.');
            return;
        }
    
        // ตรวจสอบว่า score เป็นตัวเลขที่ไม่ติดลบ
        if (isNaN(score) || score < 0) {
            console.error('Invalid score value:', score);
            alert('Score must be a non-negative number.');
            return;
        }
    
        try {
            // ส่งข้อมูลไปที่ backend ด้วย async/await
            const response = await fetch(`${apiUrl}submit-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userAddress: userAddress,
                    score: score,
                    tokenBalance: tokenBalance,
                }),
            });
    
            // ตรวจสอบว่า response สำเร็จหรือไม่
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to submit score:', errorData);
                alert(`Failed to submit score: ${errorData.error || 'Unknown error'}`);
                return;
            }
    
            const result = await response.text();
            console.log('Score submitted successfully:', result);
            alert('Score submitted successfully!');
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Error occurred while submitting score. Please try again.');
        }
    }
    




}