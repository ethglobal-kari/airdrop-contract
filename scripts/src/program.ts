import { program } from 'commander'
import fs from 'fs'
import { parseBalanceMap } from './parse-balance-map'
import { getRoot, verifyProof } from './verify'
import { BigNumber } from 'ethers'

program
    .name('merkle-root generator/verifier cli')

program.command('generate')
    .requiredOption('-i, --input <path>', 'input JSON file location containing a map of account addresses to string balances')
    .requiredOption('-o, --output <path>', 'output json file')
    .action((directory, cmd) => {
        const {
            input,
            output
        } = cmd.opts()
        const json = JSON.parse(fs.readFileSync(input, { encoding: 'utf8' }))
        if (typeof json !== 'object') throw new Error('Invalid JSON')

        fs.writeFileSync(output, JSON.stringify(parseBalanceMap(json), null, 2), 'utf-8')
    })

program.command('verify')
    .requiredOption('-i, --input <path>', 'input JSON file location containing the merkle proofs for each account and the merkle root')
    .action((directory, cmd) => {
        const {
            input
        } = cmd.opts()
        const json = JSON.parse(fs.readFileSync(input, { encoding: 'utf8' }))

        if (typeof json !== 'object') throw new Error('Invalid JSON')

        const merkleRootHex = json.merkleRoot
        const merkleRoot = Buffer.from(merkleRootHex.slice(2), 'hex')

        let balances: { index: number; account: string; amount: BigNumber }[] = []
        let valid = true

        Object.keys(json.claims).forEach((address) => {
            const claim = json.claims[address]
            const proof = claim.proof.map((p: string) => Buffer.from(p.slice(2), 'hex'))
            balances.push({ index: claim.index, account: address, amount: BigNumber.from(claim.amount) })
            if (verifyProof(claim.index, address, claim.amount, proof, merkleRoot)) {
                console.log('Verified proof for', claim.index, address)
            } else {
                console.log('Verification for', address, 'failed')
                valid = false
            }
        })

        if (!valid) {
            console.error('Failed validation for 1 or more proofs')
            process.exit(1)
        }
        console.log('Done!')

        // Root
        const root = getRoot(balances).toString('hex')
        console.log('Reconstructed merkle root', root)
        console.log('Root matches the one read from the JSON?', root === merkleRootHex.slice(2))
    })

program.parse()