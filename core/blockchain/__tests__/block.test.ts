import { Block } from '../block'
import { GENESIS } from '../../config'
import hexToBinary from 'hex-to-binary'
import { createHash } from '../../utils'

describe('Block', () => {
    const version: string = '1.0.0'
    const index: number = 1
    const timestamp: number = 2000
    const hash: string = '0'.repeat(64)
    const previousHash: string = '0'.repeat(64)
    const merkleRoot: string = '0'.repeat(64)
    const nonce: number = 0
    const difficulty: number = 0
    const data: string[] = ['a', 'b']

    const blockData: Block = {
        version,
        index,
        timestamp,
        hash,
        previousHash,
        merkleRoot,
        data,
        nonce,
        difficulty,
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

    describe('mineBlock', () => {
        it('간단 블럭생성', () => {
            const newBlock: Block = Block.generateNextBlock(GENESIS, ['asfasdf'])
            expect(newBlock.index - 1).toEqual(GENESIS.index)
        })

        // it('hexToBinary 바이너리 변환 함수 체크', () => {
        //     const hash: string = 'A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098'
        //     console.log(hexToBinary(hash))
        // })

        // it('hashMatcheDifficulty 난이도 체크', () => {
        //     const hash: string = 'A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098'
        //     const difficulty: number = 0
        //     expect(hashMatcheDifficulty(hash, difficulty)).toBe(true)
        // })

        // it('맞는 블록을 찾기', () => {
        //     const newBlock: Block = { ...block }
        //     // console.log(newBlock)
        //     let nonce = newBlock.nonce
        //     const difficulty: number = 12
        //     newBlock.timestamp = getTimestamp()

        //     while (true) {
        //         newBlock.nonce = nonce
        //         newBlock.timestamp = getTimestamp()
        //         const hash = createHash(newBlock)
        //         newBlock.hash = hash
        //         const isMine = hashMatcheDifficulty(hash, difficulty)

        //         if (isMine) {
        //             return
        //         }
        //         nonce++
        //     }
        // })

        it('FindBlock 메서드 체크', () => {
            const newBlock: Block = Block.generateNextBlock(GENESIS, ['asfasdf'])
            newBlock.difficulty = 16
            const { block } = Block.findBlock(newBlock)
            const requiredPrefix: string = '0'.repeat(difficulty)

            expect(hexToBinary(createHash(block)).startsWith(requiredPrefix)).toBe(true)
        })
    })
})

// function hashMatcheDifficulty(hash: string, difficulty: number): Boolean {
//     const bianry = hexToBinary(hash)
//     const requiredPrefix: string = '0'.repeat(difficulty)
//     return bianry.startsWith(requiredPrefix)
// }

// function hexToBinary(hash: string): string {
//     const table: any = {
//         '0': '0000',
//         '1': '0001',
//         '2': '0010',
//         '3': '0011',
//         '4': '0100',
//         '5': '0101',
//         '6': '0110',
//         '7': '0111',
//         '8': '1000',
//         '9': '1001',
//         A: '1010',
//         B: '1011',
//         C: '1100',
//         D: '1101',
//         E: '1110',
//         F: '1111',
//     }

//     let ret = ''
//     for (let i = 0; i < hash.length; i++) {
//         if (table[hash[i]]) {
//             ret += table[hash[i]]
//         }
//     }

//     return ret
// }
