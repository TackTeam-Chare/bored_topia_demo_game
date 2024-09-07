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
    }

    preload() {
        this.load.audio('coin_Bonze', 'assets/sounds/coin_Bonze.mp3');
        this.load.audio('coin_Gold_X', 'assets/sounds/coin_Gold_X.mp3');
        this.load.audio('coin_Gold', 'assets/sounds/coin_Gold.mp3');
        this.load.audio('coin_Silver', 'assets/sounds/coin_Silver.mp3');
    }

    create() {
        // Reset score when starting the game
        this.registry.set('highscore', 0);
        this.score = 0;
        this.coins = [];

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

        const topMargin = 30;
        const timeBg = this.add.image(120, 60 + topMargin, 'Clock').setDisplaySize(220, 75).setAlpha(1);
        const scoreBg = this.add.image(900, 60 + topMargin, 'Score').setDisplaySize(200, 75).setAlpha(1);

        const textStyle = {
            fontFamily: 'Arial Black',
            fontSize: '30px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        };

        this.scoreText = this.add.text(scoreBg.x, scoreBg.y, '0', textStyle).setOrigin(0.5).setDepth(1);
        this.timeText = this.add.text(timeBg.x, timeBg.y, '10', textStyle).setOrigin(0.3).setDepth(1);

        const playButton = this.add.image(512, 1450, 'Play')
            .setInteractive()
            .setScale(0.2);

        playButton.on('pointerover', () => {
            playButton.setScale(0.2);
        });

        playButton.on('pointerout', () => {
            playButton.setScale(0.175);
        });

        playButton.on('pointerdown', () => {
            this.scene.start('ClickerGame');
        });

        this.timer = this.time.addEvent({
            delay: 10000,
            callback: () => this.gameOver()
        });

        this.physics.world.setBounds(0, -400, 1024, 768 + 310);

        this.scheduleNextCoinDrop();


        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));
    }

    scheduleNextCoinDrop() {
        const delay = Phaser.Math.Between(500, 3000);
        this.time.delayedCall(delay, () => {

            const coinCount = Phaser.Math.Between(1, 10);
            for (let i = 0; i < coinCount; i++) {
                this.dropCoin();
            }
            this.scheduleNextCoinDrop();
        });
    }

    dropCoin() {

        this.noiseOffset += 0.1;

        const dispenserX = 512;
        const dispenserY = 330;

        const x = dispenserX + Phaser.Math.Between(-30, 30);
        const y = dispenserY + Phaser.Math.Between(-10, 10);

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

        coin.setScale(1.5);

        const angle = Phaser.Math.Between(0, 360);
        const speed = Phaser.Math.Between(200, 400);

        const velocityX = speed * Math.cos(Phaser.Math.DegToRad(angle));
        const velocityY = speed * Math.sin(Phaser.Math.DegToRad(angle));

        coin.setVelocity(velocityX, velocityY);

        coin.setCollideWorldBounds(true);
        coin.setBounce(0);

        coin.body.onWorldBounds = true;
        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === coin) {
                coin.destroy();
            }
        });

        coin.setInteractive();
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

        coin.disableInteractive();
        coin.setVelocity(0, 0);

        coin.play(coin.coinType.vanishAnim);

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

        const scoreText = this.add.text(coin.x, coin.y, `+${coin.coinType.score}`, {
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
            scale: {
                from: 1,
                to: 1.5
            },
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                scoreText.destroy();
            }
        });

        coin.once('animationcomplete-' + coin.coinType.vanishAnim, () => coin.destroy());

        this.score += coin.coinType.score;
        this.scoreText.setText(this.score.toString());

        this.dropCoin();
    }


    update() {

        const remainingTime = Math.ceil(this.timer.getRemainingSeconds());

        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        const formattedTime = this.formatTime(hours, minutes, seconds);

        this.timeText.setText(formattedTime);
    }

    formatTime(hours, minutes, seconds) {
        const pad = (num) => (num < 10 ? '0' : '') + num;
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    gameOver() {
        this.coins.forEach(coin => {
            if (coin.active) {
                coin.setVelocity(0, 0);
                coin.play(coin.coinType.vanishAnim);
            }
        });

        this.input.off('gameobjectdown');
        const highscore = this.registry.get('highscore');
        if (this.score > highscore) {
            this.registry.set('highscore', this.score);
        }

        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }
}