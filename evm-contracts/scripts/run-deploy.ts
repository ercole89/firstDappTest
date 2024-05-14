import { ethers, run, network } from 'hardhat';
import {
  SimpleEquippableParent,
  SimpleEquippableCatalog,
  SimpleEquippableChild
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';

async function main() {
  await deployContractsParent();
  await deployContractsChild();
  await deployContractsCatalog();
}

async function deployContractsParent(): Promise<SimpleEquippableParent> {
  console.log(`Deploying SimpleEquippableParent to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('SimpleEquippableParent');
  const collectionMeta = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/parent/parent_collection.json"
  const maxSupply = 1000;
  const royaltyRecipient = (await ethers.getSigners())[0].address;
  const royaltyPercentageBps = 300; // 3%

  if (collectionMeta === undefined || maxSupply === undefined) {
    throw new Error('Please set collectionMeta and maxSupply');
  } else {
    const [deployer] = await ethers.getSigners();
    const provider = ethers.provider;
    const nonce = await provider.getTransactionCount(deployer.address);

    console.log(nonce);
    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
    const contract: SimpleEquippableParent = await contractFactory.deploy(...args, { nonce });
    await contract.waitForDeployment();
    await delay(1000);
    const contractAddress = await contract.getAddress();
    console.log(`SimpleEquippableParent deployed to ${contractAddress}`);
    
    return contract;


  }
}
async function deployContractsChild(): Promise<SimpleEquippableChild> {
  console.log(`Deploying SimpleEquippableChild to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('SimpleEquippableChild');
  const collectionMeta = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/child/child_collection.json"
  const maxSupply = 1000;
  const royaltyRecipient = (await ethers.getSigners())[0].address;
  const royaltyPercentageBps = 300; // 3%

  if (collectionMeta === undefined || maxSupply === undefined) {
    throw new Error('Please set collectionMeta and maxSupply');
  } else {
    const [deployer] = await ethers.getSigners();
    const provider = ethers.provider;
    const nonce = await provider.getTransactionCount(deployer.address);

    console.log(nonce);
    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
    const contract: SimpleEquippableChild = await contractFactory.deploy(...args, { nonce });
    await contract.waitForDeployment();
    await delay(1000);
    const contractAddress = await contract.getAddress();
    console.log(`SimpleEquippableChild deployed to ${contractAddress}`);
    return contract;


  }
}
async function deployContractsCatalog(): Promise<SimpleEquippableCatalog> {
  console.log(`Deploying SimpleEquippableCatalog to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('SimpleEquippableCatalog');
  const collectionMeta = "ipfs://Qmby1mSBsBjgXz3vhmADa9HRmAAvetS8bBSqgVuEDzfrJ4/catalog/catalogTest.json"

  if (collectionMeta === undefined) {
    throw new Error('Please set collectionMeta and maxSupply');
  } else {
    const [deployer] = await ethers.getSigners();
    const provider = ethers.provider;
    const nonce = await provider.getTransactionCount(deployer.address);

    console.log(nonce);
    const args = [collectionMeta, 'model/gltf-binary'] as const;
    const contract: SimpleEquippableCatalog = await contractFactory.deploy(...args, { nonce });
    await contract.waitForDeployment();
    await delay(1000);
    const contractAddress = await contract.getAddress();
    console.log(`SimpleEquippableCatalog deployed to ${contractAddress}`);
    return contract;


  }
}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
if (!isHardhatNetwork()) {
  console.log('Waiting 20 seconds before verifying contract...');
  await delay(20000);
  /*
  await run('verify:verify', {
    address: contractAddress,
    constructorArguments: args,
    contract: 'contracts/SimpleEquippable.sol:SimpleEquippable',
  });

  // Only do on testing, or if whitelisted for production
  const registry = await getRegistry();
  await registry.addExternalCollection(contractAddress, args[0]);
  console.log('Collection added to Singular Registry');
}

*/