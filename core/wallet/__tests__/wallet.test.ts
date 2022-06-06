import { ISignature } from 'core/interfaces/signature.interface'
import { SHA256 } from 'crypto-js'
import { Wallet } from '../wallet'
import BN from 'bn.js'

describe('wallet 사용해보기', () => {
    let wallet: Wallet

    beforeEach(() => {
        wallet = new Wallet()
    })

    it('wallet 내용 확인해보기', () => {
        console.log(wallet.toString())
    })

    it('서명 성공 테스트 하기', () => {
        // publickey 0x02930588b2bb818bd35b65474365b9b2d6210681f85b2681bb1edd312c065e17eb
        // privatekey 0xe4e3e4578f602c6a752d24aab23ea6bf53a816f5754273bbf6e5305349f9677c
        const data = 'data'
        const signature = wallet.sign(data)
        const result = Wallet.verifySignature(data, wallet.publicKey, signature)
        expect(result).toBe(true)
    })

    it('서명 실패 테스트 하기', () => {
        // publickey 0x02930588b2bb818bd35b65474365b9b2d6210681f85b2681bb1edd312c065e17eb
        // privatekey 0xe4e3e4578f602c6a752d24aab23ea6bf53a816f5754273bbf6e5305349f9677c
        const data = 'data'
        const signature = wallet.sign(data)
        const result = Wallet.verifySignature('asdf', wallet.publicKey, signature)
        expect(result).toBe(false)
    })
})
