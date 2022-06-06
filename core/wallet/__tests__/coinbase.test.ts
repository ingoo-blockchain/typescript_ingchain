import { Chain } from '../../blockchain/chain'
import { Transaction } from '../transaction'

describe('코인베이스', () => {
    let node: Chain

    beforeEach(() => {
        node = new Chain()
    })

    it('block 생성', () => {
        // TODO : 블록데이터에 코인베이스 트랜잭션 넣기
        node.addBlock([
            Transaction.coinbaseTransaction('031510552b3dd0f88f5b300fd9e0b8e14db9bdbfaf95092b7feec7dc16eecca208', 2),
        ])
        // console.log(node.getChain())
    })
})
