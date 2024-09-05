import { Scene } from 'phaser';
import { Noise } from 'noisejs'; // Make sure to import a Perlin noise library

export class StartGame extends Scene {
    constructor() {
        super('StartGame');
        this.noise = new Noise(Math.random()); // Initialize the Perlin noise generator with a random seed
        this.noiseOffset = 0; // Starting noise offset
    }

    preload() {
        // Load audio files for different coins
        this.load.audio('coin_Bonze', 'assets/sounds/coin_Bonze.mp3');
        this.load.audio('coin_Gold_X', 'assets/sounds/coin_Gold_X.mp3');
        this.load.audio('coin_Gold', 'assets/sounds/coin_Gold.mp3');
        this.load.audio('coin_Silver', 'assets/sounds/coin_Silver.mp3');
    }

    create() {
        this.score = 0;
        this.coins = [];

        // Add background image
        this.add.image(512, 384, 'background');

        // Add a background for the score text (adjust the size of the image to fit the text)
        const scoreBg = this.add.image(120, 45, 'Bar_coin').setScale(0.6).setAlpha(0.9);

        // Add a background for the time text
        const timeBg = this.add.image(935, 45, 'Bar_time').setScale(0.6).setAlpha(0.9);

        // Define text style with appropriate size and positioning
        const textStyle = {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 1,
                stroke: true,
                fill: true
            }
        };

        this.scoreText = this.add.text(scoreBg.x, scoreBg.y, '0', textStyle).setOrigin(0.4).setDepth(1);
        this.timeText = this.add.text(timeBg.x, timeBg.y, '10', textStyle).setOrigin(0.4).setDepth(1);

        // 10-second timer
        this.timer = this.time.addEvent({ delay: 10000, callback: () => this.gameOver() });

        // Set physics world bounds
        this.physics.world.setBounds(0, -400, 1024, 768 + 310);

        // Drop initial set of coins
        for (let i = 0; i < 32; i++) {
            this.dropCoin();
        }

        // Set up click handler for coins
        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));
    }

    dropCoin() {
        // Increment noise offset to get different noise values over time
        this.noiseOffset += 0.1;

        // Use Perlin noise to calculate positions and velocities
        const noiseValueX = this.noise.perlin2(this.noiseOffset, 0);
        const noiseValueY = this.noise.perlin2(0, this.noiseOffset);

        const x = Phaser.Math.Between(128, 896);
        const y = Phaser.Math.Between(-100, -400); // Coins start off-screen for a smooth drop

        // Define coin types, animations, and their probabilities
        const coinTypes = [
            { key: 'coin', rotateAnim: 'rotate', vanishAnim: 'vanish', score: 1, weight: 50 },
            { key: 'coinBonze', rotateAnim: 'Bonze_rotate', vanishAnim: 'Bonze_vanish', score: 2, weight: 30 },
            { key: 'coinSilver', rotateAnim: 'Silver_rotate', vanishAnim: 'Silver_vanish', score: 5, weight: 10 },
            { key: 'coinGoldx2', rotateAnim: 'Goldx2_rotate', vanishAnim: 'Goldx2_vanish', score: 10, weight: 5 },
            { key: 'coinGoldx3', rotateAnim: 'Goldx3_rotate', vanishAnim: 'Goldx3_vanish', score: 20, weight: 3 },
            { key: 'coinGoldx4', rotateAnim: 'Goldx4_rotate', vanishAnim: 'Goldx4_vanish', score: 50, weight: 2 },
            { key: 'coinGoldx5', rotateAnim: 'Goldx5_rotate', vanishAnim: 'Goldx5_vanish', score: 100, weight: 1 }
        ];

        // Use a weighted random selection for more realistic rarity
        const randomCoinType = this.weightedRandom(coinTypes);

        // Create coin sprite with selected type
        const coin = this.physics.add.sprite(x, y, randomCoinType.key).play(randomCoinType.rotateAnim);

        // Apply Perlin noise to the velocity for smoother variation
        const velocityX = noiseValueX * 100;  // Adjust multiplier to change speed range
        const velocityY = noiseValueY * 200 + 300;  // Adjust multiplier to change speed range

        coin.setVelocity(velocityX, velocityY);
        coin.setCollideWorldBounds(true);
        coin.setBounce(0.9);
        coin.setInteractive();
        coin.coinType = randomCoinType;

        // Add coin to the coins array
        this.coins.push(coin);
    }

    // Function to select a coin type based on weighted probability
    weightedRandom(coinTypes) {
        const totalWeight = coinTypes.reduce((acc, coin) => acc + coin.weight, 0);
        let random = Phaser.Math.Between(0, totalWeight);

        for (let i = 0; i < coinTypes.length; i++) {
            if (random < coinTypes[i].weight) {
                return coinTypes[i];
            }
            random -= coinTypes[i].weight;
        }

        return coinTypes[0]; // Default return, should never happen if weights are correct
    }

    clickCoin(coin) {
        // Disable the coin from being clicked
        coin.disableInteractive();

        // Stop the coin's movement
        coin.setVelocity(0, 0);

        // Play the 'vanish' animation
        coin.play(coin.coinType.vanishAnim);

        // Play sound effect based on coin type
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

        // Destroy the coin after the animation completes
        coin.once('animationcomplete-' + coin.coinType.vanishAnim, () => coin.destroy());

        // Add score based on coin type
        this.score += coin.coinType.score;

        // Update the score text
        this.scoreText.setText(this.score.toString());

        // Drop a new coin
        this.dropCoin();
    }

    update() {
        // Update the time remaining
        this.timeText.setText(Math.ceil(this.timer.getRemainingSeconds()).toString());
    }

    gameOver() {
        // Stop all coins and play vanish animation
        this.coins.forEach((coin) => {
            if (coin.active) {
                coin.setVelocity(0, 0);
                coin.play(coin.coinType.vanishAnim);
            }
        });

        // Remove click handler
        this.input.off('gameobjectdown');

        // Save highscore to the registry
        const highscore = this.registry.get('highscore');

        if (this.score > highscore) {
            this.registry.set('highscore', this.score);
        }

        // Transition to the GameOver scene after a delay
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }
}
