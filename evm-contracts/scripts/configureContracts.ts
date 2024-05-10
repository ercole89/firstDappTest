import { ethers } from 'hardhat';
// Correct and check your import paths and names
import { SimpleEquippableParent, SimpleEquippableChild, SimpleEquippableCatalog } from '../typechain-types';
import { getRegistry } from './get-gegistry';
async function main() {
    const [deployer] = await ethers.getSigners();

    const contractAddresses = {
        "Parent": "0x5711F47b078fEaE6192c2E8b4Fbb7Eaa52C69349",
        "Child": "0x335af4d218601A8a6f7822a527c0369054D5276d",
        "Catalog": "0x05C6e6e94Db2129fFB167179213E70FDBA83041B"
    };

    const parentContract = await ethers.getContractAt("SimpleEquippableParent", contractAddresses['Parent'], deployer);
    const childContract = await ethers.getContractAt("SimpleEquippableChild", contractAddresses['Child'], deployer);
    const catalogContract = await ethers.getContractAt("SimpleEquippableCatalog", contractAddresses['Catalog'], deployer);

    const collectionMetaParent = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/parent/parent_collection.json"
    const collectionMetaChild = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/child/child_collection.json"
    const collectionMetaCatalog = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/catalog/catalogTest.json"
    const slotMetadata = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/catalog/cap.json"
    const parentMetadata = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/parent/3dparent.json"

    const SLOT_PART_ID = 1001;
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
        const registry = await getRegistry();
        let tx1 = await registry.addExternalCollection(contractAddresses['Parent'], collectionMetaParent);
        let tx2 = await registry.addExternalCollection(contractAddresses['Child'], collectionMetaChild);
        await Promise.all([
            tx1.wait(), tx2.wait()]);
        console.log('Collections added to Singular Registry');
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }

    await parentContract.setAutoAcceptCollection(childContract.getAddress(), true);

    
    //configure catalog
    try {

        
        let tx4 = await catalogContract.addPartList([
            {
                partId: SLOT_PART_ID,
                part: {
                    itemType: PART_TYPE_SLOT,
                    z: Z_INDEX_ITEM,
                    equippable: [contractAddresses['Child']],
                    metadataURI: `${slotMetadata}`,
                },
            },
            {
                partId: FIXED_PART_ID,
                part: {
                    itemType: PART_TYPE_FIXED,
                    z: Z_INDEX_PARENT,
                    equippable: [],
                    metadataURI: `${parentMetadata}`,
                },
            }
        ]);
        await tx4.wait();
        
        const tx = await catalogContract.setEquippableAddresses(SLOT_PART_ID, [childContract.getAddress()]);
        await tx.wait();
    } catch (error) {
        console.error('Error during catalog configuration:', error);
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
            1,
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
            1, //tokenId
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
