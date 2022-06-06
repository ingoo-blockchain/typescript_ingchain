import { Wallet } from './wallet'
import { ObjectToString } from '../utils'
import SHA256 from 'crypto-js/sha256'
import { ISignature } from 'core/interfaces/signature.interface'

const COINBASE_AMOUNT: number = 50

export interface ITxIn {
    txOutId: string
    txOutIndex: number
    signature?: ISignature
}

export class TxIn implements ITxIn {
    public txOutId: string
    public txOutIndex: number
    public signature?: ISignature

    constructor(_id: string, _index: number) {
        this.txOutId = _id
        this.txOutIndex = _index
    }
}

export interface ITxOut {
    [address: string]: number
}

export class TxOut implements ITxOut {
    [address: string]: number

    constructor(_address: string, _amount: number) {
        this[_address] = _amount
    }

    public static getAddress(output: TxOut): string {
        const [address] = this.destructuring(output)
        return address
    }

    public static getAmount(output: TxOut): number {
        const [, amount] = this.destructuring(output)
        return amount
    }

    private static destructuring(output: TxOut): [string, number] {
        const [[address, amount]] = Object.entries(output)
        return [address, amount]
    }
}

export interface ITransaction {
    hash: string
    txIns: TxIn[]
    txOuts: TxOut[]
}

export class Transaction implements ITransaction {
    public hash: string
    public txIns: TxIn[]
    public txOuts: TxOut[]

    constructor() {
        this.txIns = []
        this.txOuts = []
        this.hash = ''
    }

    static newTransaction(sender: Wallet, recipient: string, amount: number): Transaction {
        // TODO : 아래주석은 UTXO 작업완료하고 다시 작성해야함
        const transaction = new Transaction()
        const txOutId = transaction.txOuts.push(new TxOut(recipient, amount))
        transaction.txOuts.push(new TxOut(sender.publicKey, sender.balance - amount))

        // TODO : 임시로 txOutId 값으로 넣음.
        const txInId = transaction.txIns.push(new TxIn(txOutId.toString(), 1))
        transaction.hash = this.createTransactionHash(transaction)
        const signature = sender.sign(transaction.hash)
        transaction.txIns[txInId - 1].signature = signature

        return transaction
    }

    static txinSignature(_sender: Wallet, _hash: string): Failable<ISignature, string> {
        // TODO : 서명코드 예외처리 작성
        const signature = _sender.sign(_hash)
        return { isError: false, value: signature }
    }

    static createTransactionHash(_transaction: Transaction): string {
        const output: string = ObjectToString<ITxOut>(_transaction.txOuts)
        const input: string = ObjectToString<ITxIn>(_transaction.txIns)

        return SHA256(output + input).toString()
    }

    static verifyTransaction(_transaction: Transaction): boolean {
        // TODO : 아래주석은 UTXO 작업완료하고 다시 작성해야함
        try {
            // const data = this.createTransactionHash(_transaction)
            // const [address] = Object.keys(_transaction.txOuts[_transaction.txIns[0].txOutId])
            // const signature = _transaction.txIns[0].signature
            // if (signature === undefined) throw new Error('서명이 존재하지않습니다.')

            // const txHash = this.createTransactionHash(_transaction)
            // if (txHash !== _transaction.hash) throw new Error('Transaction hash 가 옳바르지 않습니다.')
            // if (!Wallet.verifySignature(data, address, signature)) throw new Error('signature가 옳바르지 않습니다.')

            return true
        } catch (e) {
            if (e instanceof Error) console.error(e.message)
            return false
        }
    }

    public static coinbaseTransaction(_address: string, _blockHeight: number): Transaction {
        const transaction = new Transaction()
        const txIn = new TxIn('', _blockHeight)

        transaction.txIns.push(txIn)
        transaction.txOuts.push(new TxOut(_address, COINBASE_AMOUNT))
        transaction.hash = this.createTransactionHash(transaction)

        return transaction
    }

    // static UnsignedTxIn(unspentTxOut: IUnspentTxOut): void {}
}
