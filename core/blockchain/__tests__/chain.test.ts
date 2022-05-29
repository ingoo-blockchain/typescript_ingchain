import { Chain } from '../chain'
import { Block } from '../block'
import { getMerkleRoot } from '../../utils'

describe('chain', () => {
    let node: Chain
    let node2: Chain

    beforeEach(() => {
        node = new Chain()
        node2 = new Chain()
        node.addBlock(['hello world1'])
        node.addBlock(['hello world2'])
        node.addBlock(['hello world3'])
        node.addBlock(['hello world4'])
        node.addBlock(['hello world5'])
        node.addBlock(['hello world6'])
        node.addBlock(['hello world7'])
        node.addBlock(['hello world8'])
        node.addBlock(['hello world9'])
        node.addBlock(['hello world10'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        node.addBlock(['hello world11'])
        console.log(node.getChain())
    })

    it('chain 데이터타입이 배열인지 확인', () => {
        expect(node.getChain() instanceof Array).toBe(true)
    })

    it('마지막 블럭 가져오는지 확인', () => {
        // expect(node.getLatestBlock().index).toEqual(11)
    })

    it('블럭 추가되는지 확인', () => {
        node2.addBlock(['hello world!!!'])
        // expect(node2.getLatestBlock()).toEqual()
    })

    it('node 체인 검증하기', () => {
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

    it('getDifficulty 함수 테스트', () => {
        console.log(getDifficulty(node.getChain()))
    })

    function getDifficulty(chain: Block[]): number {
        const BLOCK_GENERATION_INTERVAL: number = 10 // 10분
        const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10 // 10배수 블록검증 상수
        const latestBlock: Block = chain[chain.length - 1] // 마지막 블록가져오기

        /*
        console.log(latestBlock.index)
        console.log(DIFFICULTY_ADJUSTMENT_INTERVAL)
        console.log(latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0) // index값이 10의 배수라면
        console.log(latestBlock.index !== 0) // index === 0 은 제네시스 블록
        console.log(latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0)
        */

        // index값이 10의 배수가 아니고, 제네시스 블록이면 함수종료
        if (latestBlock.index === 0) return 0
        if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return latestBlock.difficulty

        // 현재 index - 10 의 블록의 정보를 가져오기
        const previousBlock: Block = chain[chain.length - DIFFICULTY_ADJUSTMENT_INTERVAL]
        // 블록 생성 예상시간 : 10개 * 10분 = 100분
        const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL
        // 실제 블록 생성 시간 :  이전블록 -10 번째의 만든날짜 - 현 만들 블록 만든날짜 = timeTaken
        const timeTaken: number = previousBlock.timestamp - latestBlock.timestamp

        // 실제 블록 생성 시간  < 블록 생성 예상시간 / 2 : 예상시간보다 2배나 일찍 만들었다면.
        let num = 0
        if (timeTaken < timeExpected / 2) num = 1
        // 실제 블록 생성시간 > 블록 생성 예상시간 * 2 : 예상시간보다 2배나 늦게 만들어졌다면
        else if (timeTaken > timeExpected * 2) num = -1

        // 10번째 전에 생성된 난이도 + num return
        return previousBlock.difficulty + num

        /*
            테스트 방법은 블록을 생성할떄마다 난이도를 구해주는 함수를 실행해보면 될거같다.
        */
    }
})
