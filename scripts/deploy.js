const hre = require('hardhat');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const ERC20 = await hre.ethers.getContractFactory('ERC20');
    const contract = await ERC20.deploy();
    await contract.deployed();

    console.log(`ERC20 deployed to: ${contract.address}`);
    console.log(`Deployer address: ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });