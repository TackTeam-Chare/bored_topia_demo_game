import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        //  Load the background
        this.load.setPath('assets');
        // Load common assets
        this.load.image('background', '/ui/background.png');
        this.load.image('background_game_over', '/ui/background_game_over.png');
        this.load.image('logo', '/ui/logo.png');
        this.load.image('Bar_coin', '/ui/Bar_coin.png');
        this.load.image('Bar_time', '/ui/Bar_time.png');

        // Background
        this.load.setPath('assets/ui/background/');
        this.load.image('PlayPage', 'PlayPage.png');
        this.load.image('BG', 'BG.png');
        this.load.image('OpeningPage', 'OpeningPage.png');
        this.load.image('CoinDispenser', 'CoinDispenser.png');
        this.load.image('Score', 'Score.svg');
        this.load.image('Clock', 'Clock.svg');
        this.load.image('Play', 'Play.png');

        // // Buttons
        // this.load.setPath('assets/ui/buttons/');
        // this.load.image('Play', 'Play.png');

        // coin
        this.load.setPath('assets/ui/coins');
        this.load.atlas('coinBonze', 'coinBonze.png', 'coinBonze.json');
        this.load.atlas('coinSilver', 'coinSilver.png', 'coinSilver.json');
        this.load.atlas('coinGoldx2', 'coinGoldx2.png', 'coinGoldx2.json');
        this.load.atlas('coinGoldx3', 'coinGoldx3.png', 'coinGoldx3.json');
        this.load.atlas('coinGoldx4', 'coinGoldx4.png', 'coinGoldx4.json');
        this.load.atlas('coinGoldx5', 'coinGoldx5.png', 'coinGoldx5.json');

        // star
        this.load.setPath('assets/ui/stars');
        this.load.image('PgScore_0star', 'PgScore_0star.png');
        this.load.image('PgScore_1star', 'PgScore_1star.png');
        this.load.image('PgScore_2star', 'PgScore_2star.png');
        this.load.image('PgScore_3star', 'PgScore_3star.png');
        this.load.image('Level_Complete', 'Level_Complete.png');



    }

    create ()
    {

        this.anims.create({
            key: 'Bonze_rotate', 
            frames: this.anims.generateFrameNames('coinBonze', { prefix: 'coinBonze_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Bonze_vanish',
            frames: this.anims.generateFrameNames('coinBonze', { prefix: 'coinBonze_vanish_', start: 1, end: 4 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Silver_rotate', 
            frames: this.anims.generateFrameNames('coinSilver', { prefix: 'coinSilver_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Silver_vanish',
            frames: this.anims.generateFrameNames('coinSilver', { prefix: 'coinSilver_vanish_', start: 1, end: 4 }),
            frameRate: 10
        });


        this.anims.create({
            key: 'Goldx2_rotate', 
            frames: this.anims.generateFrameNames('coinGoldx2', { prefix: 'coinGoldx2_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx2_vanish',
            frames: this.anims.generateFrameNames('coinGoldx2', { prefix: 'coinGoldx2_vanish_', start: 1, end: 4 }),
            frameRate: 10
        });


        this.anims.create({
            key: 'Goldx3_rotate', 
            frames: this.anims.generateFrameNames('coinGoldx3', { prefix: 'coinGoldx3_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx3_vanish',
            frames: this.anims.generateFrameNames('coinGoldx3', { prefix: 'coinGoldx3_vanish_', start: 1, end: 4 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Goldx4_rotate', 
            frames: this.anims.generateFrameNames('coinGoldx4', { prefix: 'coinGoldx4_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx4_vanish',
            frames: this.anims.generateFrameNames('coinGoldx4', { prefix: 'coinGoldx4_vanish_', start: 1, end: 4 }),
            frameRate: 10
        });

        this.anims.create({
            key: 'Goldx5_rotate', 
            frames: this.anims.generateFrameNames('coinGoldx5', { prefix: 'coinGoldx5_', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 5.5,
            repeat: -1
        });

        this.anims.create({
            key: 'Goldx5_vanish',
            frames: this.anims.generateFrameNames('coinGoldx5', { prefix: 'coinGoldx5_vanish_', start: 1, end: 4 }),
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

              //  A global value to store the highscore in
              this.registry.set('highscore', 0);

              // this.scene.start('Preloader');
      
              this.input.once('pointerdown', () => {
      
                  this.scene.start('Preloader');
      
              });
    }
}
