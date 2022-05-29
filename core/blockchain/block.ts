import { IBlock } from '../interfaces/block.interface'
import hexToBinary from 'hex-to-binary'
import { getTimestamp, createHash, jsonToString, getMerkleRoot } from '../utils'
import { GENESIS } from '../config'

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

        const hash = createHash(_blockData)

        return {
            ..._blockData,
            hash,
            data,
        }
    }

    static isValidGenesis(_block: Block): boolean {
        const genesis = this.generatorGenesis()
        if (jsonToString(_block) !== jsonToString(genesis)) return false
        return true
    }

    // 검색이 맞을떄까지 반복하는 함수
    static findBlock(_block: Block): Block {
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

        return _block
    }
}
