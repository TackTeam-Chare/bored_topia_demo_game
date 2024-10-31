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

    init(data) {
        this.userAddress = data.userAddress || '';
    }

    create(data) {
        // รับ scene ก่อนหน้า จาก data parameter
        this.previousScene = data.previousScene || 'MainMenu'; // ค่าเริ่มต้นเป็น MainMenu ถ้าไม่มี

        // Set up the main background
        const bg = this.add.image(512, 384, 'BG').setOrigin(0.5);

         // แสดงเฉพาะ 6 ตัวท้ายของที่อยู่ MetaMask
        const shortAddress = this.userAddress.slice(-6);
      
          // Display score text
          const shortAddressTextStyle = { 
            fontFamily: 'Arial Black', 
            fontSize: 38, 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        const shortAddressText = this.add.text(600, 1200, `${shortAddress}`, shortAddressTextStyle)
        .setAlign('center')
        .setOrigin(0.5);

    this.tweens.add({
        targets: shortAddressText,
        scale: { from: 0.9, to: 1.1 },
        duration: 1000,
        yoyo: true,
        repeat: -1
    });
        const closeButton = this.add.image(930, 130, 'button_exit').setScale(0.9).setInteractive();
        closeButton.on('pointerdown', () => {
            this.scene.start(this.previousScene); // กลับไปยัง scene ก่อนหน้า
        });
        this.addHoverEffect(closeButton);

        // Display Invite Code Label
        this.add.text(600, 1300, 'YOUR INVITE CODE', {
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
        this.addTypingEffect(512, 1420, inviteText, {
            fontFamily: 'Arial',
            fontSize: '32px',
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
        input.maxLength = 6;
    
        const offsetX = 37;
        input.style.position = 'absolute';
        input.style.top = `${window.innerHeight / 2 - 15}px`;
        input.style.left = `${window.innerWidth / 2 - 100 + offsetX}px`;
    
        input.style.width = '200px';
        input.style.height = '40px';
        input.style.fontSize = '18px';
        input.style.border = 'none';
        input.style.textAlign = 'center';
        input.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        input.style.color = '#FFFFFF';
        input.style.outline = 'none';
    
        // ดึงที่อยู่จาก MetaMask เพื่อส่งไปกับโค้ดเชิญ
        const getUserAddress = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    return await signer.getAddress();
                } catch (error) {
                    console.error('MetaMask login failed:', error);
                    return null;
                }
            }
            return null;
        };
    
        input.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && input.value.length === 6) {
                const code = input.value;
                console.log(`Submitting code: ${code}`);
    
                try {
                    const inviterAddress = await getUserAddress(); // ดึงที่อยู่จาก MetaMask
    
                    if (!inviterAddress) {
                        alert('Please connect to MetaMask to submit invite.');
                        return;
                    }
    
                    const response = await fetch(
                        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}submit-invite`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code, userAddress: inviterAddress }),  // ส่งที่อยู่ผู้เชิญไป backend
                        }
                    );
    
                    const result = await response.json();
                    console.log('Response from server:', result);
    
                    if (response.ok) {
                        alert('Invite code submitted successfully!');
                        input.value = ''; // ล้างช่อง input
                    } else {
                        console.error('Failed to submit invite code:', result);
                        alert(result.error || 'Failed to submit invite code. Please try again.');
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
