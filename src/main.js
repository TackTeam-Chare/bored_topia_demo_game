import { ClickerGame } from './scenes/StartGame';
import { GameOver } from './scenes/EndGame';
import { Leaderboard } from './scenes/Leaderboard';
import { HallOfFame } from './scenes/HallOfFame';
import { Achievement } from './scenes/Achievement';
import { MainMenu } from './scenes/Home';
import { Preloader } from './scenes/Preloader';
import { HowToPlay } from './scenes/HowToPlay';
import { InviteCodeScreen } from './scenes/InviteCode';

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
        InviteCodeScreen,
        HowToPlay,
        ClickerGame,
        GameOver,
        Leaderboard,
        HallOfFame,
        Achievement
    ]
};

export default new Phaser.Game(config);
