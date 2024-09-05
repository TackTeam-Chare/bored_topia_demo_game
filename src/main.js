import { Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { HomeGame } from './scenes/HomeGame';
import { StartGame } from './scenes/StartGame';
import { GameOver } from './scenes/GameOver';
import { Preloader } from './scenes/Preloader';

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
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
        Boot,
        Preloader,
        HomeGame,
        StartGame,
        GameOver
    ]
};

export default new Game(config);
