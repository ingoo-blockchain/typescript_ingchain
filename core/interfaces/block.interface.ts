export interface IBlock {
    version: string
    index: number
    previousHash: string
    timestamp: number
    merkleRoot: string
    difficulty: number
    nonce: number
}

export interface Block extends IBlock {
    hash: string
    data: string[]
}
