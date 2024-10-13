import { Scene } from 'phaser';
import { Noise } from 'noisejs';

export class ClickerGame extends Scene {
    constructor() {
        super('ClickerGame');
        this.noise = new Noise(Math.random());
        this.noiseOffset = 0;
        this.isGameOver = false; // State to check if the game is over
        this.soundOn = true; // Variable to track sound state
        this.tokenBalanceMultiplier = 1; // Multiplier based on token balance
    }

    init(data) {
        this.userAddress = data.userAddress || '';  // Capture user address from HowToPlay scene
        this.tokenBalance = data.tokenBalance || 0;
        this.tokenBalanceMultiplier = this.tokenBalance ? parseFloat(this.tokenBalance) : 1; // Use token balance as multiplier
    }

    preload() {
        this.load.audio('coin_Bonze', 'assets/sounds/coin_Bonze.mp3');
        this.load.audio('coin_Gold_X', 'assets/sounds/coin_Gold_X.mp3');
        this.load.audio('coin_Gold', 'assets/sounds/coin_Gold.mp3');
        this.load.audio('coin_Silver', 'assets/sounds/coin_Silver.mp3');
        this.load.image('wallet', 'assets/ui/background/wallet.svg');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_setting', 'assets/ui/background/button_setting.svg');
        this.load.image('button_sound_on', 'assets/ui/background/button_sound_on.svg');
        this.load.image('button_sound_off', 'assets/ui/background/button_sound_off.svg');
        this.load.image('play_button', 'assets/ui/background/Play.png');
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
        const walletIcon = this.add.image(850, 80 + topMargin, 'wallet').setDisplaySize(290, 110).setAlpha(1);

        const textStyle = {
            fontFamily: 'Arial Black',
            fontSize: '26px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        };

        // Show the user address on the wallet
        const shortAddress = `${this.userAddress.slice(0, 6)}...${this.userAddress.slice(-4)}`;
        this.add.text(walletIcon.x + 40, walletIcon.y + 25, ` ${shortAddress}`, textStyle).setOrigin(0.5, 0.5);
        this.scoreText = this.add.text(scoreBg.x, scoreBg.y, '0', textStyle).setOrigin(0.5).setDepth(1);
        this.timeText = this.add.text(timeBg.x, timeBg.y, '10', textStyle).setOrigin(0.3).setDepth(1);

        // Play button and rearranged buttons
        const playButton = this.add.image(512, 1600, 'play_button').setInteractive().setScale(0.22);

        const buttonScale = 0.6;
        const buttonY = playButton.y + 45;
        const buttonSpacing = 105;

        // Rearrange the buttons
        const leaderboardButton = this.add.image(playButton.x - 1.5 * buttonSpacing, buttonY, 'button_leaderboard').setScale(buttonScale).setInteractive();
        const soundButton = this.add.image(playButton.x - 0.5 * buttonSpacing, buttonY, 'button_sound_on').setScale(buttonScale).setInteractive();
        const settingButton = this.add.image(playButton.x + 0.5 * buttonSpacing, buttonY, 'button_setting').setScale(buttonScale).setInteractive();
        const exitButton = this.add.image(playButton.x + 1.5 * buttonSpacing, buttonY, 'button_exit').setScale(buttonScale).setInteractive();

        // Add hover effect
        this.addHoverEffect(soundButton);
        this.addHoverEffect(settingButton);
        this.addHoverEffect(exitButton);
        this.addHoverEffect(leaderboardButton);

        // Sound Button Toggle
        soundButton.on('pointerdown', () => {
            this.soundOn = !this.soundOn;
            soundButton.setTexture(this.soundOn ? 'button_sound_on' : 'button_sound_off');
        });

        // Leaderboard Button Action
        leaderboardButton.on('pointerdown', () => {
            console.log('Open Leaderboard');
        });

        // Settings Button Action
        settingButton.on('pointerdown', () => {
            console.log('Open Settings');
        });

        // Exit Button Action
        exitButton.on('pointerdown', () => {
            console.log('Exit Game');
            this.scene.start('MainMenu');
        });

        // Set the world bounds to the entire visible screen
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        // Timer initialization (ensure it's set correctly)
        this.timer = this.time.addEvent({
            delay: 15000,
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

        const dispenserX = 512;
        const dispenserY = 330;

        const x = dispenserX + Phaser.Math.Between(-30, 30);
        const y = dispenserY + Phaser.Math.Between(-10, 10);

        const coinTypes = [
            { key: 'coinBonze', rotateAnim: 'Bonze_rotate', vanishAnim: 'Bonze_vanish', score: 1, weight: 50 },
            { key: 'coinSilver', rotateAnim: 'Silver_rotate', vanishAnim: 'Silver_vanish', score: 2, weight: 30 },
            { key: 'coinGoldx2', rotateAnim: 'Goldx2_rotate', vanishAnim: 'Goldx2_vanish', score: 10, weight: 20 },
            { key: 'coinGoldx3', rotateAnim: 'Goldx3_rotate', vanishAnim: 'Goldx3_vanish', score: 30, weight: 10 },
            { key: 'coinGoldx4', rotateAnim: 'Goldx4_rotate', vanishAnim: 'Goldx4_vanish', score: 50, weight: 5 },
            { key: 'coinGoldx5', rotateAnim: 'Goldx5_rotate', vanishAnim: 'Goldx5_vanish', score: 100, weight: 2 }
        ];

        const randomCoinType = this.weightedRandom(coinTypes);
        const coin = this.physics.add.sprite(x, y, randomCoinType.key).play(randomCoinType.rotateAnim);

        coin.setScale(1.5);
        coin.setInteractive(new Phaser.Geom.Circle(coin.width / 2, coin.height / 2, 40), Phaser.Geom.Circle.Contains); // Add hit area to improve click accuracy

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

        // Apply token balance multiplier to the score
        const finalScore = coin.coinType.score * this.tokenBalanceMultiplier;

        if (this.soundOn) {  // Play sound only if sound is on
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

        const scoreText = this.add.text(coin.x, coin.y, `+${finalScore}`, {
            fontFamily: 'Arial Black',
            fontSize: '40px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            y: coin.y - 50,
            alpha: 0,
            scale: { from: 1, to: 1.5 },
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => scoreText.destroy()
        });

        coin.once('animationcomplete-' + coin.coinType.vanishAnim, () => coin.destroy());

        this.score += finalScore;
        this.scoreText.setText(this.score.toString());

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
    
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }
    
    submitScore() {
        const score = this.score;
        const userAddress = this.userAddress;
    
        // Make sure we don't submit the score if userAddress is empty (trial mode)
        if (!userAddress) {
            console.log('User is not logged in with MetaMask, skipping score submission.');
            return;
        }
    
        fetch('http://localhost:3000/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userAddress, score }),
        })
        .then(response => response.text())
        .then(data => console.log('Score submitted:', data))
        .catch(error => console.error('Error submitting score:', error));
    }
}
