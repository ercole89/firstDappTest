import { ethers } from 'hardhat';

async function main() {
    // Indirizzo del contratto deployato
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Crea una nuova istanza del contratto utilizzando l'oggetto ethers di Hardhat
    const contract = await ethers.getContractAt('SimpleEquippable', contractAddress);

    // Chiama la funzione name() del contratto
    const name = await contract.name();
    console.log('Il nome del contratto è:', name);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
