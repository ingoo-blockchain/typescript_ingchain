import { Transaction } from '../transaction'
import { IWallet, Wallet } from '../wallet'

describe('Transaction', () => {
    let transaction: Transaction, wallet: IWallet, recipient: string, amount: number
    // sender: IWallet, recipient: string, amount: number
    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = '02930588b2bb818bd35b65474365b9b2d6210681f85b2681bb1edd312c065e17eb'
        transaction = wallet.createTransaction(recipient, amount)
    })

    it('sender 잔고 확인하기.', () => {
        const result = transaction.txOuts.find((output): boolean => {
            const [address] = Object.keys(output)
            return address === wallet.publicKey
        })

        if (result === undefined) return expect(true).toBe(false)

        const [balance] = Object.values(result)
        expect(balance).toEqual(wallet.balance - amount) // 950
    })

    it('recipient 잔고 확인하기.', () => {
        const result = transaction.txOuts.find((output): boolean => {
            const [address] = Object.keys(output)
            return address === recipient
        })

        if (result === undefined) return expect(true).toBe(false)

        const [balance] = Object.values(result)
        expect(balance).toEqual(amount)
    })

    it('Transaction signature 확인하기', () => {
        // transaction.hash = 'asdfasdf'
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })
})
