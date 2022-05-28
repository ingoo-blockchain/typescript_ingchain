// import { Block } from '../core/blockchain/block'
// import { BlockStruct, BlockBasic } from '../core/interfaces/block.interface'

// describe('블록 내용 검증', () => {
//     test('제네시스 블록 생성', () => {
//         console.log(Block.generatorGenesis())
//     })

//     test('타임 스탬프 생성', () => {
//         const timestamp = Block.getTimestamp()
//         console.log(timestamp)
//     })

//     test('머클루트 생성', () => {
//         const data: string[] = ['example', 'test', 'hello world', 'hi']
//         const merkleroot = Block.generateMerkleRoot(data)
//         console.log(merkleroot)
//     })

//     test('해시 생성', () => {
//         const data: string[] = ['example', 'test', 'hello world', 'hi']

//         const blockData: BlockBasic = {
//             version: '1.0.0',
//             index: 1,
//             previousHash: Block.generatorGenesis().hash,
//             timestamp: Block.getTimestamp(),
//             merkleRoot: Block.generateMerkleRoot(data),
//         }
//         console.log(Block.calculateHash(blockData))
//     })

//     test('블록 생성', () => {
//         const previousBlock = Block.generatorGenesis()
//         const data: string[] = ['example', 'test', 'hello world', 'hi']
//         console.log(Block.generateNextBlock(previousBlock, data))
//     })
// })
