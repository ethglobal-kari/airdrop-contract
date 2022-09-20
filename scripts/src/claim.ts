import { ethers } from 'ethers'
import * as FactoryArtifact from '../../out/DistributorFactory.sol/DistributorFactory.json'
import * as TokenArtifact from '../../out/MockToken.sol/MockToken.json'
import * as DistributorArtifact from '../../out/IMerkleDistributor.sol/IMerkleDistributor.json'

require('dotenv').config()

const { PRIVATE_KEY, RPC_URL } = process.env
async function main() {
    const rootHash = '0x1da196315ac7c30f65fe47ec461bd4bff2b2d100ba0ec0201d37d5b6821aff3a'
    const incentiveId = 'd87b94e8-4411-4c3f-b88a-8afaa6cb71e'
    const totalAmount = '500000000'
    const account = '0x012ed55a0876Ea9e58277197DC14CbA47571CE28'
    const proofs = [
        "0x6b5afc97f42ca6229fafe1f85881659423c045595c37f6846a31fab981fa7f70",
        "0x7ce19b127c83cdca9ee43db2109073100901384af46845a78b6d9440a74b49bb",
        "0xc98598ca9f1cd932f1374cb3719c75b99a6ab31015b556d512269eb704f2798f",
        "0xc0be7dbd77c4ed4a0892a0ce137fb65585586a96823e37ec091cbe69cae05a37",
        "0x396fac7a54930ac1ff8baad706eb4ebd3860a8439f169dc19d32e41be87884aa",
        "0x5086e98e7681d1b1e34cc505b11bf633f0f9320174279a1bd89118cf435bd01f",
        "0xe71b985e413b1fb73c446c3db0e7c400a9cec00fad7ea4a4c6721296a37cb11f"
    ]
    const provider = ethers.providers.getDefaultProvider(RPC_URL)
    const privateKey = PRIVATE_KEY || ''
    const wallet = new ethers.Wallet(privateKey, provider)
    const tokenContract = new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.bytecode.object, wallet)
    const token = await tokenContract.deploy("Fake USD", "FUSD", 6)
    console.log(`mock token: ${token.address}`)
    const factoryContract = new ethers.ContractFactory(FactoryArtifact.abi, FactoryArtifact.bytecode.object, wallet)
    const factory = await factoryContract.deploy()
    console.log(`factory: ${factory.address}`)
    const tx = await factory.createDistributor(token.address, rootHash, totalAmount, incentiveId)
    const response = await tx.wait()
    const distributorAddress = response.events[0].args.distributor
    console.log(`distributor: ${distributorAddress}`)
    const distributor = new ethers.Contract(distributorAddress, DistributorArtifact.abi, wallet)
    // mint token to distributor
    await token.mint(distributorAddress, totalAmount)
    await distributor.claim(0, account, '10000000', proofs)
    console.log(`isClaimed: ${await distributor.isClaimed(0)}`)
    console.log(`claimed: ${await distributor.claimed()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });