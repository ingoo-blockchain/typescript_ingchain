import { Block } from '../block'
import { GENESIS } from '../../config'

describe('Block', () => {
    const version: string = '1.0.0'
    const index: number = 1
    const timestamp: number = 2000
    const hash: string = '0'.repeat(64)
    const previousHash: string = '0'.repeat(64)
    const merkleRoot: string = '0'.repeat(64)
    const data: string[] = ['a', 'b']

    const blockData: Block = {
        version,
        index,
        timestamp,
        hash,
        previousHash,
        merkleRoot,
        data,
    }

    const block = new Block(blockData)

    it('version, index, timestamp, hash, previousHash, merkleRoot, data 값 확인', () => {
        expect(block.version).toEqual(version)
        expect(block.index).toEqual(index)
        expect(block.timestamp).toEqual(timestamp)
        expect(block.hash).toEqual(hash)
        expect(block.previousHash).toEqual(previousHash)
        expect(block.merkleRoot).toEqual(merkleRoot)
        expect(block.data).toEqual(data)
    })

    describe('gensis', () => {
        const genesisBlock = Block.generatorGenesis()
        it('제네시스블록 instanceof', () => {
            expect(typeof genesisBlock).toEqual('object')
        })

        it('제네시스 블록 과 config 내용 테스트', () => {
            expect(genesisBlock).toEqual(GENESIS)
        })
    })

    // 나중에 할거..
    describe('mineBlock', () => {})
})
