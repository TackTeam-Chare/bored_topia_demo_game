import { Scene } from 'phaser';

export class HowToPlay extends Scene {
    constructor() {
        super('HowToPlay');
        this.typingText = '';
        this.fullText = 'Click on the falling coins \nto boost your score'; 
        this.textIndex = 0;
    }

    preload() {
        this.load.image('howToPlayBackground', 'assets/ui/background/HowToPlayPage.png');
        this.load.image('howToPlay', 'assets/ui/background/HowToPlay.png');
        this.load.image('connectWallet', 'assets/ui/background/Connect_wallet.png');
        this.load.image('buttonPlay', 'assets/ui/background/button_play.svg');
        this.load.image('buttonSkip', 'assets/ui/background/button_skip.svg');
        this.load.css('fonts', 'assets/fonts/AlteHaasGroteskBold.ttf');
        this.load.css('fonts', 'assets/fonts/AlteHaasGroteskRegular.ttf');
    }

    create() {
        // Background setup
        const howToPlayBg = this.add.image(0, 0, 'howToPlayBackground').setOrigin(0, 0);
        howToPlayBg.setScale(Math.max(this.sys.game.config.width / howToPlayBg.width, this.sys.game.config.height / howToPlayBg.height));

        // How to play section image (animation)
        const howToPlay = this.add.image(512, 400, 'howToPlay').setScale(0.2);
        this.tweens.add({
            targets: howToPlay,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const tapToWinText = this.add.text(500, 350, 'TAP TO WIN:', {
            fontFamily: 'AlteHaasGroteskBold',
            fontSize: '40px',
            color: '#8B4513',
            align: 'center'
        }).setOrigin(0.5);

        const instructionsText = this.add.text(500, 420, '', {
            fontFamily: 'AlteHaasGroteskRegular',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        this.typeText(instructionsText);

        this.createButtons();
    }

    createButtons() {
        // Play button
        const playButton = this.add.image(350, 620, 'buttonPlay').setInteractive().setScale(0.6);
        playButton.on('pointerdown', () => {
            this.scene.start('ClickerGame');  // Start the clicker game scene
        });
        // เพิ่ม hover effect สำหรับปุ่ม Play
        this.addHoverEffect(playButton);
    
        // Skip button
        const skipButton = this.add.image(650, 620, 'buttonSkip').setInteractive().setScale(0.6);
        skipButton.on('pointerdown', () => {
            this.scene.start('ClickerGame');  // Skip and start the clicker game scene
        });
        // เพิ่ม hover effect สำหรับปุ่ม Skip
        this.addHoverEffect(skipButton);
    
        // Connect Wallet button (centered)
        const centerX = this.cameras.main.width / 2;
        const connectWalletButton = this.add.image(centerX, 780, 'connectWallet').setInteractive().setScale(0.15);
        connectWalletButton.on('pointerdown', () => {
            console.log('Wallet connected!');  // Placeholder for connecting wallet functionality
        });
        // เพิ่ม hover effect สำหรับปุ่ม Connect Wallet
        this.addHoverEffect(connectWalletButton);
    }
    
    addHoverEffect(button) {
        // เมื่อเมาส์เลื่อนเข้าเปลี่ยนสเกลเพิ่มขึ้นเล็กน้อย
        button.on('pointerover', () => {
            button.setScale(button.scaleX * 1.1);
        });
    
        // เมื่อเมาส์เลื่อนออก กลับคืนสู่ขนาดปกติ
        button.on('pointerout', () => {
            button.setScale(button.scaleX / 1.1);
        });
    }
    

    typeText(instructionsText) {
        // เพิ่มทีละตัวอักษร พร้อม animation
        if (this.textIndex < this.fullText.length) {
            this.typingText += this.fullText[this.textIndex];
            instructionsText.setText(this.typingText); // แสดงข้อความทีละตัว
            this.textIndex++;

            // ใช้ delayedCall เพื่อทำให้การพิมพ์สมูท (หน่วงเวลา)
            this.time.delayedCall(50, () => this.typeText(instructionsText)); // 50ms ต่อ 1 ตัวอักษร
        }
    }
}
