import { Chain } from '../../blockchain/chain'
import { ITxIn, Transaction, TxIn, TxOut } from '../transaction'
import { UnspentTxOut } from '../utxo'
import { GENESIS, INITIAL_BALANCE } from '../../config'
import _ from 'lodash'
import { Wallet } from '../wallet'
import { validate } from 'uuid'

describe('utxo 테스트', () => {
    let node: Chain
    let unspentTxOut: UnspentTxOut[] = []
    let transaction: Transaction, wallet: Wallet, recipient: string, amount: number

    beforeEach(() => {
        node = new Chain()
        wallet = new Wallet()
        amount = 50
        recipient = '02930588b2bb818bd35b65474365b9b2d6210681f85b2681bb1edd312c065e17eb'
        transaction = wallet.createTransaction(recipient, amount)
    })

    it('제네시스 트랜잭션 값', () => {
        // console.log('transaction : ', Transaction.createTransactionHash(GENESIS.data[0]))
    })

    it('코인베이스 트랜잭션 유효성 검사 함수', () => {
        expect(validateCoinbaseTx(GENESIS.data[0], GENESIS.index).isError).toBe(false)
    })

    it('트랜잭션 유효성 검사 함수', () => {
        validateBlockTransactions(GENESIS.data, unspentTxOut, GENESIS.index)
    })

    it('미사용 트랜잭션 첫사용하기', () => {
        // unspentTxOut = processTransaction(GENESIS.data, unspentTxOut, GENESIS.index)
        GENESIS.data.push(transaction)
        console.log(GENESIS.data)
        processTransaction(GENESIS.data, unspentTxOut, GENESIS.index)
    })
})

// 제네시스 블록 , 빈배열 , 0
function processTransaction(transactions: Transaction[], UnspentTxOuts: UnspentTxOut[], blockIndex: number) {
    // TODO : 1. 트랜잭션 유효 체크 2. UnspentTxOuts 추가하기

    // 1. 트랜잭션 유효 체크
    try {
        validateBlockTransactions(transactions, UnspentTxOuts, blockIndex)
        // 2. UnspentTxOuts 추가하기
    } catch (e) {
        if (e instanceof Error) console.log(e.message)
    }
}

function validateBlockTransactions(transactions: Transaction[], UnspentTxOuts: UnspentTxOut[], blockIndex: number) {
    // TODO :  1. 이후 트랜잭션 전체 검사

    // 최초의 트랜잭션 (코인베이스)
    const coinbaseTx = transactions[0]
    const validateCoinbase = validateCoinbaseTx(transactions[0], blockIndex)
    if (validateCoinbase.isError) throw new Error(`${validateCoinbase.error} \n ${JSON.stringify(coinbaseTx)}`)

    // TxIn 유효성 검사 체크
    const txIns: TxIn[] = transactions.reduce((acc: any, tx: any) => {
        if (tx.txIns instanceof Array) acc.push(...tx.txIns)
        else acc.push(tx.txIns)
        return acc
    }, [])

    const vaildInTxn = hasDuplicates(txIns)
    if (vaildInTxn.isError) throw new Error(`${vaildInTxn.error}`)

    // 1. 이후 트랜잭션 전체 검사
    const normalTransactions: Transaction[] = transactions.slice(1)
    const result = normalTransactions.map((tx) => {
        const data = validateTransaction(tx, UnspentTxOuts)
        if (data.isError === true) throw new Error(data.error)
        return !data.isError
    })

    console.log(result)
}

function hasDuplicates(txIns: TxIn[]): Failable<undefined, string> {
    // const groups = _.countBy(txIns, (txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
    const groups = txIns.reduce((acc: any, txIn: TxIn) => {
        const key = acc[txIn.txOutId + txIn.txOutIndex]
        const value = key === undefined ? 1 : key + 1
        acc = {
            ...acc,
            [txIn.txOutId + txIn.txOutIndex]: value,
        }
        return acc
    }, {})
    const result = new Set<string>(Object.values(groups))
    if (result.size < 1) return { isError: true, error: '중복된 TxIn이 존재합니다.' }
    return { isError: false, value: undefined }
}

function validateCoinbaseTx(_transaction: Transaction, _blockIndex: number): Failable<undefined, string> {
    // 코인베이스 트랜잭션 유효성 검사 함수
    if (_transaction === null) return { isError: true, error: '블록의 첫번째 트랜잭션이 코인베이스가 아닙니다.' }
    if (Transaction.createTransactionHash(_transaction) !== _transaction.hash)
        return { isError: true, error: '트랜잭션 해시값이 옳바르지 않습니다.' }
    if (_transaction.txIns.length !== 1)
        return { isError: true, error: '하나의 코인베이스 트랜잭션에는 하나의 txin이 존재합니다.' }
    if (_transaction.txIns[0].txOutIndex !== _blockIndex)
        return { isError: true, error: '블록인덱스값이 옳바르지 않습니다.' }
    if (_transaction.txOuts.length !== 1)
        return { isError: true, error: '코인베이스에서는  트랙잭션이 하나의 txOut이 존재합니다.' }
    if (TxOut.getAmount(_transaction.txOuts[0]) !== INITIAL_BALANCE)
        return { isError: true, error: 'INITIAL_BALANCE 값이 옳바르지 않습니다.' }

    return { isError: false, value: undefined }
}

function validateTransaction(_transaction: Transaction, _unspentTxOuts: UnspentTxOut[]): Failable<undefined, string> {
    /**
     * TODO : Transaction 유효성 검사
     * 1. transaction Hash 유효성 검사
     * 2. Transaction.TxIn 유효성 검사
     * 3. Transaction.TxIn values 유효성 검사
     * 4. Transaction.TxOut values 유효성 검사
     *  */
    // 1. Transaction Hash 검사
    if (Transaction.createTransactionHash(_transaction) !== _transaction.hash)
        return { isError: true, error: 'Transaction Hash가 옳바르지 않습니다.' }

    _transaction.txIns.map((TxIn) => validateTxIn(TxIn, _transaction, _unspentTxOuts))

    return { isError: false, value: undefined }
}

function validateTxIn(_txIn: TxIn, _transaction: Transaction, _unspentTxOuts: UnspentTxOut[]): boolean {
    return true
}
