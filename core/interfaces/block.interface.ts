export interface IBlock {
    version: string
    index: number
    previousHash: string
    timestamp: number
    merkleRoot: string
}

export interface Block extends IBlock {
    hash: string
    data: string[]
}
