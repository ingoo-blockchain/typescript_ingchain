import { Block } from './block'
import { getMerkleRoot } from '../utils'
import { DIFFICULTY_ADJUSTMENT_INTERVAL } from '../config'

export class Chain {
    private blockchain: Block[]

    constructor() {
        this.blockchain = [Block.generatorGenesis()]
    }

    getChain(): Block[] {
        return this.blockchain
    }

    getLatestBlock(): Block {
        return this.blockchain[this.blockchain.length - 1]
    }

    getAdjustmentBlock(): Block {
        const block: Block =
            this.blockchain.length < DIFFICULTY_ADJUSTMENT_INTERVAL
                ? this.blockchain[0]
                : this.blockchain[this.blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL]
        return block
    }

    // update:chain.ts/addBlock
    // addBlock(newBlock: Block): Boolean {
    //     if (!this.isValidNewBlock(newBlock, this.getLatestBlock())) return false
    //     this.blockchain.push(newBlock)
    //     return true
    // }
    addBlock(data: string[]): Boolean {
        const latestBlock: Block = this.getLatestBlock()
        const adjustmentBlock: Block = this.getAdjustmentBlock()
        const difficulty = Block.getDifficulty(latestBlock, adjustmentBlock)
        latestBlock.difficulty = difficulty
        const newBlock = Block.generateNextBlock(latestBlock, data)

        if (!this.isValidNewBlock(newBlock, this.getLatestBlock())) return false
        this.blockchain.push(newBlock)
        return true
    }

    isValidNewBlock(_newBlock: Block, _previousBlock: Block): Boolean {
        switch (true) {
            // 이전블록 Index 검증
            case _newBlock.index !== _previousBlock.index + 1:
                console.log('Invalid block')
                return false
            // 이전블록의 hash 값이 옳바른지 확인
            case _newBlock.previousHash !== _previousBlock.hash:
                console.log('Invalid previousHash')
                return false
            // 새로만들 블록의 Data 내용이 변경사항이없는지 체크
            case getMerkleRoot(_newBlock.data) !== _newBlock.merkleRoot:
                console.log('Invalid merkleRoot')
                return false
            default:
                return true
        }
    }

    isValidChain(_newChain: Block[]): Boolean {
        const currentChains = this.getChain()
        if (!Block.isValidGenesis(currentChains[0])) {
            console.log('invaild genesis block')
            return false
        }

        for (let i = 1; i < _newChain.length; i++) {
            const newBlock = _newChain[i]
            const previousBlock = _newChain[i - 1]
            if (!this.isValidNewBlock(newBlock, previousBlock)) return false
        }
        return true
    }

    replaceChain(_newChain: Block[]): Boolean {
        if (_newChain.length <= this.getChain().length) {
            console.log('invaild chain length')
            return false
        }

        if (!this.isValidChain(_newChain)) {
            console.log('Invalid chain')
            return false
        }

        this.blockchain = _newChain
        return true
    }
}
