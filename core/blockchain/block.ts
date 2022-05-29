import { IBlock } from '../interfaces/block.interface'
import hexToBinary from 'hex-to-binary'
import { getTimestamp, createHash, jsonToString, getMerkleRoot } from '../utils'
import { GENESIS, DIFFICULTY_ADJUSTMENT_INTERVAL, BLOCK_GENERATION_INTERVAL } from '../config'

export class Block implements IBlock {
    public version: string
    public index: number
    public hash: string
    public previousHash: string
    public timestamp: number
    public merkleRoot: string
    public difficulty: number
    public nonce: number
    public data: string[]

    constructor(_block: Block) {
        this.version = _block.version
        this.index = _block.index
        this.hash = _block.hash
        this.previousHash = _block.previousHash
        this.timestamp = _block.timestamp
        this.merkleRoot = _block.merkleRoot
        this.difficulty = _block.difficulty
        this.nonce = _block.nonce
        this.data = _block.data
    }

    static generatorGenesis(): Block {
        return GENESIS
    }

    static generateBlockHeader(_prevBlock: Block, data: string[]): IBlock {
        const block: IBlock = {
            version: _prevBlock.version,
            index: _prevBlock.index + 1,
            previousHash: _prevBlock.hash,
            timestamp: getTimestamp(),
            merkleRoot: getMerkleRoot<string>(data),
            nonce: _prevBlock.nonce,
            difficulty: _prevBlock.difficulty,
        }

        return block
    }

    static generateNextBlock(_prevBlock: Block, data: string[]): Block {
        const _blockData: IBlock = this.generateBlockHeader(_prevBlock, data)
        const { block, hash } = this.findBlock(_blockData)

        return {
            ...block,
            hash,
            data,
        }
    }

    static isValidGenesis(_block: Block): boolean {
        const genesis = this.generatorGenesis()
        if (jsonToString(_block) !== jsonToString(genesis)) return false
        return true
    }

    //step .2
    // 검색이 맞을떄까지 반복하는 함수
    static findBlock(_block: IBlock): { block: IBlock; hash: string } {
        let nonce = 0
        let hashBinary: string, hash: string, requiredPrefix: string

        do {
            nonce++
            _block.nonce = nonce
            _block.timestamp = getTimestamp()
            hash = createHash(_block)
            hashBinary = hexToBinary(hash)
            requiredPrefix = '0'.repeat(_block.difficulty)
        } while (!hashBinary.startsWith(requiredPrefix))

        return {
            block: _block,
            hash,
        }
    }

    static getDifficulty(_latestBlock: Block, _adjustmentBlock: Block): number {
        // const latestBlock: Block = chain[chain.length - 1]

        if (_latestBlock.index === 0) return 0
        if (_latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return _latestBlock.difficulty

        // const previousBlock: Block = chain[chain.length - DIFFICULTY_ADJUSTMENT_INTERVAL]
        const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL
        const timeTaken: number = _adjustmentBlock.timestamp - _latestBlock.timestamp

        let num = 0
        if (timeTaken < timeExpected / 2) num = 1
        else if (timeTaken > timeExpected * 2) num = -1

        return _adjustmentBlock.difficulty + num
    }
}
