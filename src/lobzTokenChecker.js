const { ethers } = window;  // Access ethers from the global object

// Elements from the HTML
const connectButton = document.getElementById('connectButton');
const userAddressP = document.getElementById('userAddress');
const tokenBalanceP = document.getElementById('tokenBalance');

// Event listener for the connect button
if (connectButton) {
    connectButton.addEventListener('click', async () => {
        await getUserBlobzBalance();
    });
}

async function getUserBlobzBalance() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask detected');
        try {
            // ขอสิทธิ์เข้าถึงบัญชี
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // สร้าง provider และ signer จาก MetaMask
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();

            // รับที่อยู่กระเป๋าของผู้ใช้
            const userAddress = await signer.getAddress();
            if (userAddressP) {
                userAddressP.textContent = `Address: ${userAddress}`;
            }

            // ตรวจสอบว่าผู้ใช้อยู่บนเครือข่าย Optimism หรือไม่
            let network = await provider.getNetwork();
            console.log(`Connected to network: ${network.chainId}`);
            if (network.chainId !== 10) { // 10 คือ chain ID ของ Optimism
                try {
                    // ลองสลับไปยังเครือข่าย Optimism
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xA' }], // 0xA เป็นเลขฐานสิบหกของ 10
                    });
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    signer = provider.getSigner();
                } catch (switchError) {
                    if (switchError.code === 4902) {  // รหัสข้อผิดพลาดสำหรับ chain ที่ไม่รู้จัก
                        console.log('Adding the Optimism network to MetaMask.');
                        // เพิ่มเครือข่าย Optimism
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xA', // 0xA คือเลขฐานสิบหกสำหรับ 10
                                chainName: 'Optimism',
                                rpcUrls: ['https://mainnet.optimism.io'],
                                nativeCurrency: {
                                    name: 'Ether',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                blockExplorerUrls: ['https://optimistic.etherscan.io'],
                            }],
                        });
                        // ลองสลับไปที่ Optimism อีกครั้งหลังจากเพิ่มเครือข่ายแล้ว
                        provider = new ethers.providers.Web3Provider(window.ethereum);
                        signer = provider.getSigner();
                    } else {
                        alert('กรุณาสลับไปยังเครือข่าย Optimism เพื่อดำเนินการต่อ.');
                        return;
                    }
                }
            }

            // กำหนดสัญญา Blobz token
            const tokenAddress = '0x3aa14ed2d1a65a58df0237fa84239f97ff4e9b42';
            const tokenABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function name() view returns (string)",
                "function symbol() view returns (string)"
            ];
            const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

            // รับรายละเอียด token และยอดคงเหลือ
            const [tokenName, tokenSymbol, tokenDecimals, balance] = await Promise.all([
                tokenContract.name(),
                tokenContract.symbol(),
                tokenContract.decimals(),
                tokenContract.balanceOf(userAddress)
            ]);

            // แปลงยอดคงเหลือจาก Wei เป็นหน่วย token
            const formattedBalance = ethers.utils.formatUnits(balance, tokenDecimals);

            // แสดงยอดคงเหลือของ token
            if (tokenBalanceP) {
                tokenBalanceP.textContent = `${tokenName} (${tokenSymbol}) Balance: ${formattedBalance}`;
            }

            // ส่งอีเวนต์สำหรับ Phaser เพื่อจับ
            document.dispatchEvent(new CustomEvent('walletConnected', {
                detail: { userAddress, tokenBalance: formattedBalance }
            }));

        } catch (error) {
            console.error('Error accessing MetaMask:', error);
        }
    } else {
        console.log('MetaMask not detected');
        alert('กรุณาติดตั้ง MetaMask หรือส่วนขยายกระเป๋าเงิน Ethereum อื่นๆ.');
    }
}


// Export the function for use in other files
export { getUserBlobzBalance };
