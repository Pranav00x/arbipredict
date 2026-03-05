import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Chainlink ETH/USD Price Feed on Arbitrum Mainnet
    // https://docs.chain.link/data-feeds/price-feeds/addresses?network=arbitrum
    const PRICE_FEED_ADDRESS = "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612";

    const ArbiPredict = await ethers.getContractFactory("ArbiPredict");
    const arbiPredict = await ArbiPredict.deploy(PRICE_FEED_ADDRESS);

    await arbiPredict.waitForDeployment();

    const address = await arbiPredict.getAddress();
    console.log("ArbiPredict deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
