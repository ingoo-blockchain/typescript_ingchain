import { Block } from './interfaces/block.interface'

export const BLOCK_GENERATION_INTERVAL: number = 10
export const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10
export const BLOCK_GENERATION_TIME: number = 60 // 60초
export const GENESIS: Block = {
    version: '1.0.0',
    index: 0,
    hash: '0'.repeat(64),
    previousHash: '0'.repeat(64),
    timestamp: 1231006506,
    merkleRoot: 'A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098',
    data: ['The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'],
    difficulty: 0,
    nonce: 0,
}
