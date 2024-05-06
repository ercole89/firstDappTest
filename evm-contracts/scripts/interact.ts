import { ethers } from 'hardhat';

async function main() {
    // Indirizzo del contratto deployato
    const contractAddress = '0xE750c43dA4c9743f6E1eB0F9741189fE1ad70545';

    // Crea una nuova istanza del contratto utilizzando l'oggetto ethers di Hardhat
    const contract = await ethers.getContractAt('SimpleEquippable', contractAddress);

    // Chiama la funzione name() del contratto
    const name = await contract.name();
    console.log('Il nome del contratto è:', name);

    // Indirizzo al quale mintare l'NFT
    const recipientAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

    // Numero di token da mintare
    const numToMint = 1;

    // Token URI
    const tokenURI = 'ipfs://QmVbEo1YeAK2ihvFy8ND5Rp6eEJ6hPy4kfHete6xK83DNw';

    // Chiamata alla funzione mint
    const transaction = await contract.mint(recipientAddress, numToMint, tokenURI);
    console.log('Minting in progress...');

    // Attesa della conferma della transazione
    const receipt = await transaction.wait();
    console.log(`Minting completed. Check transaction: ${receipt.transactionHash}`);
}




main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
