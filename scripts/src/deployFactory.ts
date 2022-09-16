import { ethers } from 'ethers'
import * as FactoryArtifact from '../../out/DistributorFactory.sol/DistributorFactory.json'

require('dotenv').config()

const { PRIVATE_KEY, RPC_URL } = process.env
async function main() {
    const provider = ethers.providers.getDefaultProvider(RPC_URL)
    const privateKey = PRIVATE_KEY || ''
    const wallet = new ethers.Wallet(privateKey, provider)
    const factoryContract = new ethers.ContractFactory(FactoryArtifact.abi, FactoryArtifact.bytecode.object, wallet)
    const factory = await factoryContract.deploy()
    console.log(`factory: ${factory.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });