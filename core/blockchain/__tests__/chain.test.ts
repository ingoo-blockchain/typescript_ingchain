import { Chain } from '../chain'
import { GENESIS } from '../../config'
import { Block } from '../block'
import { getMerkleRoot } from '../../utils'

describe('chain', () => {
    let node: Chain
    let node2: Chain
    let newBlock: Block

    beforeEach(() => {
        node = new Chain()
        node2 = new Chain()
        newBlock = Block.generateNextBlock(GENESIS, ['asfasdf'])
        node.addBlock(newBlock)
        node.addBlock(Block.generateNextBlock(node.getLatestBlock(), ['hello world!']))
        node.addBlock(Block.generateNextBlock(node.getLatestBlock(), ['hello world2']))
        node.addBlock(Block.generateNextBlock(node.getLatestBlock(), ['hello world3']))
    })

    it('chain 데이터타입이 배열인지 확인', () => {
        expect(node.getChain() instanceof Array).toBe(true)
    })

    it('마지막 블럭 가져오는지 확인', () => {
        expect(node.getLatestBlock().index).toEqual(4)
    })

    it('블럭 추가되는지 확인', () => {
        node2.addBlock(newBlock)
        expect(node2.getLatestBlock()).toEqual(newBlock)
    })

    it('블럭 유효성 검사 확인', () => {
        const mockBlock: Block = { ...newBlock }
        mockBlock.data = ['abc']

        expect(node.isValidNewBlock(mockBlock, node.getLatestBlock())).toBe(false)
    })

    it('node 체인 검증하기', () => {
        console.log(node.getChain().length, node2.getChain().length)
        const result = node2.isValidChain(node.getChain())
        expect(result).toBe(true)
    })

    it('merkle 루트 확인해보기..', () => {
        const blockchain = node.getChain()
        for (let i = 0; i < blockchain.length; i++) {
            expect(getMerkleRoot(blockchain[i].data)).toEqual(blockchain[i].merkleRoot)
        }
    })

    it('node 체인과 node2 체인 비교후, 다른경우 블록 바꾸기.', () => {
        const result = node2.replaceChain(node.getChain())
        expect(result).toBe(true)
    })
})
