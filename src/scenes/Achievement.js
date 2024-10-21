export class Achievement extends Phaser.Scene {
    constructor() {
        super('Achievement');
    }

    preload() {
        this.load.image('BG', 'assets/ui/background/BG.png');
        this.load.image('Achievement', 'assets/ui/background/Achievement.png');
        this.load.image('InviteFriends', 'assets/ui/background/Invite_friends.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('button_leaderboard', 'assets/ui/background/button_leaderboard.svg');
        this.load.image('button_setting', 'assets/ui/background/button_setting.svg');
    }

    create() {
        // พื้นหลัง
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);

        // Animation ของ Achievement
        const stars = this.add.image(512, 680, 'Achievement').setOrigin(0.5);
        this.tweens.add({
            targets: stars,
            scale: { from: 0.05, to: 0.25 },
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // ปุ่มต่าง ๆ (Settings, Exit, Leaderboard)
        const playButton = this.add.image(510, 890, 'button_setting').setScale(0.7).setInteractive();
        const exitButton = this.add.image(630, 890, 'button_exit').setScale(0.7).setInteractive();
        const leaderboardButton = this.add.image(380, 890, 'button_leaderboard').setScale(0.7).setInteractive();
        const inviteFriendsButton = this.add.image(512, 1200, 'InviteFriends').setScale(0.17).setInteractive();

        // การจัดการเหตุการณ์คลิกปุ่ม
        playButton.on('pointerdown', () => console.log('Settings Clicked'));
        exitButton.on('pointerdown', () => console.log('Exit Clicked'));
        inviteFriendsButton.on('pointerdown', () => console.log('Invite Friends Clicked'));

        this.addHoverEffect(playButton);
        this.addHoverEffect(exitButton);
        this.addHoverEffect(leaderboardButton);
        this.addHoverEffect(inviteFriendsButton);

        // **แสดงข้อความหลังจากเพิ่ม UI อื่น ๆ** เพื่อให้แน่ใจว่าข้อความอยู่ด้านบนสุด
        const userAddress = this.registry.get('userAddress') || 'Not Connected';
        const tokenBalance = this.registry.get('tokenBalance') || '0.0';
        const highScore = this.registry.get('highscore') || 0;
        const shortAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

        this.add.text(565, 585, `${shortAddress}`, {
            fontFamily: 'Arial Black',
            fontSize: '30px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(535, 640, ` ${highScore}`, {
            fontFamily: 'Arial Black',
            fontSize: '30px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(550, 705, `${tokenBalance} tokens`, {
            fontFamily: 'Arial Black',
            fontSize: '30px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

     
        // ข้อความเชิญชวนเพื่อนพร้อมเอฟเฟกต์พิมพ์ข้อความ
        const bonusText = 'Invite friends to play. Both you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1400, bonusText, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            lineSpacing: 5
        });

        // คลิกเพื่อกลับไปที่เมนูหลัก
        this.input.once('pointerdown', () => {
            this.registry.set('highscore', 0);
            this.scene.start('MainMenu');
        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    addTypingEffect(x, y, text, style) {
        const textObject = this.add.text(x, y, '', style).setOrigin(0.5);
        let index = 0;

        this.time.addEvent({
            delay: 50,
            callback: () => {
                textObject.text += text[index];
                index++;
                if (index >= text.length) {
                    this.time.removeAllEvents();
                }
            },
            repeat: text.length - 1
        });
    }
}
