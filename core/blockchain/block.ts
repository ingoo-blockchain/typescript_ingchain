import { IBlock } from '../interfaces/block.interface'
import { getTimestamp, createHash, jsonToString, getMerkleRoot } from '../utils'
import { GENESIS } from '../config'

export class Block implements IBlock {
    public version: string
    public index: number
    public hash: string
    public previousHash: string
    public timestamp: number
    public merkleRoot: string
    public data: string[]

    constructor(_block: Block) {
        this.version = _block.version
        this.index = _block.index
        this.hash = _block.hash
        this.previousHash = _block.previousHash
        this.timestamp = _block.timestamp
        this.merkleRoot = _block.merkleRoot
        this.data = _block.data
    }

    static generatorGenesis(): Block {
        return GENESIS
    }

    static generateNextBlock(_prevBlock: Block, data: string[]): Block {
        const _blockData: IBlock = {
            version: _prevBlock.version,
            index: _prevBlock.index + 1,
            previousHash: _prevBlock.hash,
            timestamp: getTimestamp(),
            merkleRoot: getMerkleRoot<string>(data),
        }

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
}
