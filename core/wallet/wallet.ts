import { INITIAL_BALANCE } from '../config'
import elliptic from 'elliptic'
import { ISignature } from 'core/interfaces/signature.interface'
import SHA256 from 'crypto-js/sha256'
import { Transaction } from './transaction'

const ec = new elliptic.ec('secp256k1')

export type IWallet = Wallet
export class Wallet {
    public balance: number
    public keyPair: elliptic.ec
    public publicKey: string

    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex', true)
    }

    // static getSignature(privKey: string, data: string): ISignature {
    //     const hash = SHA256(data).toString()
    //     const keyPair = ec.keyFromPrivate(privKey)
    //     const signature = keyPair.sign(hash)
    //     return {
    //         r: signature.r,
    //         s: signature.s,
    //         v: '0x36',
    //     }
    // }

    toString() {
        return `
            Wallet - 
            publicKey: 0x${this.publicKey}
            privateKey: 0x${this.keyPair.getPrivate().toString(16)}
            balance  : ${this.balance}
            `
    }

    sign(data: any): ISignature {
        const hash = SHA256(data).toString()
        const signature = this.keyPair.sign(hash)
        return {
            r: signature.r,
            s: signature.s,
            v: '0x36',
        }
    }

    static verifySignature(data: string, publicKey: string, signature: ISignature): boolean {
        const hash = SHA256(data).toString() // 트랜잭션 hash
        const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')
        return keyFromPublic.verify(hash, signature)
    }

    createTransaction(recipient: string, amount: number) {
        return Transaction.newTransaction(this, recipient, amount)
    }
}
