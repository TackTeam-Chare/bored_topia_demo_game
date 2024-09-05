import {
    Scene
} from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'preloader');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {

        // Background
        this.load.setPath('assets/ui/background');
        this.load.image('clock', 'Clock.svg');
        this.load.image('Coin_dispenser', 'Coin_dispenser.png');
        this.load.image('Score', 'Score.svg');

        // Page
        this.load.setPath('assets/ui/background/pages');
        this.load.image('How_to_play_page', 'How_to_play_page.png');
        this.load.image('How_to_play_sign', 'How_to_play_sign.png');
        this.load.image('Opening_page', 'Opening_page.png');
        this.load.image('Play_page', 'Play_page.png');
        this.load.image('BG', 'BG.png');

        // Logo
        this.load.setPath('assets/ui/logo');
        this.load.image('logo', 'Logo.png');

        // Actions

        // Coins
        this.load.setPath('assets/ui/actions/coins');
        this.load.atlas('Coin_0', 'Coin_0.svg');
        this.load.atlas('Coin_1', 'Coin_1.svg');
        this.load.atlas('Coin_x2', 'Coin_x2.svg');
        this.load.atlas('Coin_x3', 'Coin_x3.svg');
        this.load.atlas('Coin_x4', 'Coin_x4.svg');
        this.load.atlas('Coin_x5', 'Coin_x5.svg');

        // Star
        this.load.setPath('assets/ui/actions/stars');
        this.load.image('Level_complete_1_star', 'Level_complete_1_star.png');
        this.load.image('Level_complete_2_star', 'Level_complete_2_star.png');
        this.load.image('Level_complete_3_star', 'Level_complete_3_star.png');
        this.load.image('Level_complete_logo', 'Level_complete_logo.png');

        // Start
        this.load.setPath('assets/ui/actions/start');
        this.load.image('Start_1', 'Start_1.svg');
        this.load.image('Start_2', 'Start_.png');
        this.load.image('Start_3', 'Start_3.png');
        this.load.image('Start_4', 'Start_4.png');

        // Buttons
        this.load.setPath('assets/ui/actions/buttons');
        this.load.image('Play', 'Play.png');

        // Sounds Effect
        this.load.setPath('assets/sounds');
        this.load.audio('coin_Bonze', 'coin_Bonze.mp3');
        this.load.audio('coin_Silver', 'coin_Silver.mp3');
        this.load.audio('coin_Gold', 'coin_Gold.mp3');
        this.load.audio('coin_Gold_X', 'coin_Gold_X.mp3');


    }

    create() {
        this.anims.create({
            key: 'rotate',
            frames: this.anims.generateFrameNames('coin', {
                prefix: 'coin_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'vanish',
            frames: this.anims.generateFrameNames('coin', {
                prefix: 'vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });


        this.anims.create({
            key: 'Bonze_rotate',
            frames: this.anims.generateFrameNames('coinBonze', {
                prefix: 'coinBonze_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Bonze_vanish',
            frames: this.anims.generateFrameNames('coinBonze', {
                prefix: 'coinBonze_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Silver_rotate',
            frames: this.anims.generateFrameNames('coinSilver', {
                prefix: 'coinSilver_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Silver_vanish',
            frames: this.anims.generateFrameNames('coinSilver', {
                prefix: 'coinSilver_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });


        this.anims.create({
            key: 'Goldx2_rotate',
            frames: this.anims.generateFrameNames('coinGoldx2', {
                prefix: 'coinGoldx2_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx2_vanish',
            frames: this.anims.generateFrameNames('coinGoldx2', {
                prefix: 'coinGoldx2_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });


        this.anims.create({
            key: 'Goldx3_rotate',
            frames: this.anims.generateFrameNames('coinGoldx3', {
                prefix: 'coinGoldx3_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx3_vanish',
            frames: this.anims.generateFrameNames('coinGoldx3', {
                prefix: 'coinGoldx3_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Goldx4_rotate',
            frames: this.anims.generateFrameNames('coinGoldx4', {
                prefix: 'coinGoldx4_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx4_vanish',
            frames: this.anims.generateFrameNames('coinGoldx4', {
                prefix: 'coinGoldx4_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Goldx5_rotate',
            frames: this.anims.generateFrameNames('coinGoldx5', {
                prefix: 'coinGoldx5_',
                start: 1,
                end: 7,
                zeroPad: 2
            }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx5_vanish',
            frames: this.anims.generateFrameNames('coinGoldx5', {
                prefix: 'coinGoldx5_vanish_',
                start: 1,
                end: 4
            }),
            frameRate: 10
        });


        this.scene.transition({
            target: 'MainMenu',
            duration: 1000,
            moveBelow: true,
            onUpdate: (progress) => {
                this.cameras.main.setAlpha(1 - progress);
            }
        });
    }
}