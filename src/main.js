import { ClickerGame } from './scenes/StartGame';
import { Game } from 'phaser';
import { GameOver } from './scenes/EndGame';
import { MainMenu } from './scenes/Home';
import { Preloader } from './scenes/Preloader';
import { HowToPlay } from './scenes/HowToPlay';

const width = 1024; 
const aspectRatio = 8358 / 4697;

const config = {
    type: Phaser.AUTO,
    width: 1024, 
    height: Math.round(1024 * (8358 / 4697)),
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: [
        Preloader,
        MainMenu,
        HowToPlay,
        ClickerGame,
        GameOver
    ]
};

export default new Phaser.Game(config);

