import SHA256 from 'crypto-js/sha256'
import { IBlock } from '../interfaces/block.interface'
import merkle from 'merkle'

export function jsonToString<T>(data: T): string {
    return JSON.stringify(data)
}

export function createHash(_data: IBlock): string {
    const { version, index, previousHash, timestamp, merkleRoot, difficulty, nonce } = _data
    const data = `${version}${index}${previousHash}${timestamp}${merkleRoot}${difficulty}${nonce}`
    return SHA256(JSON.stringify(data)).toString()
}

export function getTimestamp(): number {
    return Math.floor(new Date().getTime() / 1000)
}

export function getMerkleRoot<T>(data: T[]): string {
    const merkleTree = merkle('sha256').sync(data)
    return merkleTree.root() || '0'.repeat(64)
}
