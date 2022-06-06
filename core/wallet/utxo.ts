import { Transaction, TxOut, ITxIn } from './transaction'

export interface IUnspentTxOut {
    readonly txOutId: string
    readonly txOutIndex: number
    readonly address: string
    readonly amount: number
}

export class UnspentTxOut implements IUnspentTxOut {
    public txOutId: string
    public txOutIndex: number
    public address: string
    public amount: number

    constructor({ txOutId, txOutIndex, address, amount }: IUnspentTxOut) {
        this.txOutId = txOutId
        this.txOutIndex = txOutIndex
        this.address = address
        this.amount = amount
    }

    public static findUnspentTxOut(_unspentTxOuts: UnspentTxOut[], txIn: ITxIn): Failable<IUnspentTxOut, string> {
        const { txOutId, txOutIndex } = txIn
        const unspentTxOut = _unspentTxOuts.find((uTxO) => uTxO.txOutId === txOutId && uTxO.txOutIndex === txOutIndex)
        if (unspentTxOut === undefined) return { isError: true, error: 'unspentTxOut를 찾지못했습니다.' }
        return { isError: false, value: unspentTxOut }
    }

    public static newUnspentTxOuts(_transactions: Transaction[]): UnspentTxOut[] {
        return _transactions
            .map((transaction: Transaction) => transaction.txOuts.map(this.outputCallback(transaction)))
            .reduce((acc, _transactions) => acc.concat(_transactions), [])
    }

    // public static consumedTxOuts(_transactions: Transaction[]): UnspentTxOut[] {
    // TODO : coinbase 이후에 작업할 예정
    //     _transactions.map((transaction: Transaction) => transaction.txIns).reduce((acc, item) => acc.concat(item), [])
    // }

    private static outputCallback(_transaction: Transaction) {
        return (txOut: TxOut, index: number) => {
            const address = TxOut.getAddress(txOut)
            const amount = TxOut.getAmount(txOut)
            const unspentTxOut: UnspentTxOut = {
                txOutId: _transaction.hash,
                txOutIndex: index,
                address,
                amount,
            }
            return new this(unspentTxOut)
        }
    }
}
