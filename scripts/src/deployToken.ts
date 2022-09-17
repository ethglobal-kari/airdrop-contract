import { ethers } from 'ethers'
import * as TokenArtifact from '../../out/MockToken.sol/MockToken.json'

require('dotenv').config()

const { PRIVATE_KEY, RPC_URL } = process.env
async function main() {
    const provider = ethers.providers.getDefaultProvider(RPC_URL)
    const privateKey = PRIVATE_KEY || ''
    const wallet = new ethers.Wallet(privateKey, provider)
    const tokenContract = new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.bytecode.object, wallet)
    const token = await tokenContract.deploy("Fake USD", "FUSD", 6)
    console.log(`token: ${token.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });