export class InviteCodeScreen extends Phaser.Scene {
    constructor() {
        super('InviteCodeScreen');
    }

    preload() {
        // Load background and assets
        this.load.image('BG', 'assets/ui/background/BG.png');
        this.load.image('button_exit', 'assets/ui/background/button_exit.svg');
        this.load.image('wallet', 'assets/ui/background/wallet.svg');
    }

    create() {
        // Set up the main background
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);

        // Close button (Exit)
        const closeButton = this.add.image(930, 130, 'button_exit').setScale(0.9).setInteractive();
        closeButton.on('pointerdown', () => {
            this.scene.start('HowToPlay'); // Return to HowToPlay scene
        });
        this.addHoverEffect(closeButton);

        // Display Invite Code Label
        this.add.text(580, 810, 'YOUR INVITE CODE', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // Wallet background for the invite code input
        const codeBox = this.add.image(512, 880, 'wallet').setScale(2);

        // Add the input field over the wallet
        this.createInputField();

        // Add typing animation for the invite description text
        const inviteText = 'Invite friends to play.\nBoth you and your friend will earn a sweet\n50% bonus on your friend\'s first round scores.';
        this.addTypingEffect(512, 1150, inviteText, {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 600 },
        });
    }

    addHoverEffect(button) {
        button.on('pointerover', () => button.setScale(button.scaleX * 1.1));
        button.on('pointerout', () => button.setScale(button.scaleX / 1.1));
    }

    createInputField() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter Invite Code';
        input.maxLength = 6; // จำกัดจำนวนตัวอักษรสูงสุด 6 ตัว
    
        const offsetX = 60; // ปรับตำแหน่งให้อยู่ข้างขวา
        input.style.position = 'absolute';
        input.style.top = `${window.innerHeight / 2 - 20}px`;
        input.style.left = `${window.innerWidth / 2 - 130 + offsetX}px`;
    
        input.style.width = '240px';
        input.style.height = '40px';
        input.style.fontSize = '24px';
        input.style.border = 'none';
        input.style.textAlign = 'center';
        input.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        input.style.color = '#FFFFFF';
        input.style.outline = 'none';
    
        // ส่งโค้ดไป backend เมื่อกด Enter และโค้ดมีความยาวครบ 6 ตัว
        input.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && input.value.length === 6) {
                const code = input.value;
                console.log(`Submitting code: ${code}`);
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}submit-invite`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code })
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Code submitted successfully:', result);
                        alert('Invite code submitted successfully!');
                        input.value = ''; // ล้างช่อง input หลังส่งสำเร็จ
                    } else {
                        console.error('Failed to submit invite code');
                        alert('Failed to submit invite code. Please try again.');
                    }
                } catch (error) {
                    console.error('Error submitting invite code:', error);
                    alert('Error occurred while submitting invite code.');
                }
            }
        });
    
        document.body.appendChild(input);
    
        // ลบ input field เมื่อออกจาก scene เพื่อป้องกัน memory leak
        this.events.on('shutdown', () => input.remove());
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
            repeat: text.length - 1,
        });
    }
}