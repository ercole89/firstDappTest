
import { ethers } from 'hardhat';
// Correct and check your import paths and names
import { SimpleEquippableParent, SimpleEquippableChild, SimpleEquippableCatalog } from '../typechain-types';
import { getRegistry } from './get-gegistry';
async function main() {
    const [deployer] = await ethers.getSigners();

    const contractAddresses = {
        "Parent": "0x140Ef06953323AFe07E7977551f9997C20C4cb6d",
        "Child": "0x29E41DB208FeF5d5fA5186D13A57E467fF23f948",
        "Catalog": "0xF6bB6B8d8606dE0200E60Ee0De32a134A52a1f8B"
    };

    const parentContract = await ethers.getContractAt("SimpleEquippableParent", contractAddresses['Parent'], deployer);
    const childContract = await ethers.getContractAt("SimpleEquippableChild", contractAddresses['Child'], deployer);
    const catalogContract = await ethers.getContractAt("SimpleEquippableCatalog", contractAddresses['Catalog'], deployer);

    const parentMetadata = "ipfs://QmUVN2do1M3Y4yxAsTrCxLTjnNii57gceEQJRBuerDXHTe"

    const SLOT_PART_ID = 1001;
    const EQUIPPABLE_ID = SLOT_PART_ID;
    const FIXED_PART_ID = 1;

    const PART_TYPE_SLOT = 1;
    const PART_TYPE_FIXED = 2;

    const Z_INDEX_ITEM = 2;
    const Z_INDEX_PARENT = 1;

    try {


        let tx = await parentContract.name();
        console.log(`Contract name: ${tx}`); // Assuming .name() is a call and not a transaction
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }



    try {

        let txParent = await parentContract.mint(
            deployer.address, // To
            1,
            parentMetadata, // TokenURI
        );

        await txParent.wait();
        console.log('Mint Parent');
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }

    try {

        let txAddEquippableAssetEntry = await parentContract.addEquippableAssetEntry(
            EQUIPPABLE_ID,
            catalogContract.getAddress(),
            parentMetadata,
            [SLOT_PART_ID,
                FIXED_PART_ID
            ]
        );

        await txAddEquippableAssetEntry.wait();
        console.log('txAddEquippableAssetEntry');
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }

    try {

        let txaddAssetToToken = await parentContract.addAssetToToken(
            6, //tokenId
            1, //AssetId
            0
        );

        await txaddAssetToToken.wait();
        console.log('addAssetToToken');
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }


}

main().catch(console.error);
