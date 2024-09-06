import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }
    
    create() {

        const score = this.registry.get('highscore');


        this.add.image(512, 384, 'BG');

        const starImages = ['0star', '1star', '2star', '3star'];
        const stars = this.add.image(512, 1300, `PgScore_${starImages[3]}`).setOrigin(0.5);

        this.tweens.add({
            targets: stars,
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });


      const scoreBoxTextStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff', stroke: '#000000', strokeThickness: 4 };
      const scoreText = this.add.text(600,1365, `${score}`, scoreBoxTextStyle).setAlign('center').setOrigin(0.5);

      this.tweens.add({
          targets: scoreText,
          scale: { from: 0.9, to: 1.1 },
          duration: 1000,
          yoyo: true,
          repeat: -1
      });

        const animatedHouse = this.add.image(512, 450, 'Level_Complete').setScale(0.2).setOrigin(0.5);
        this.tweens.add({
            targets: animatedHouse,
            y: '+=30',
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: animatedHouse,
            alpha: { from: 0.7, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}