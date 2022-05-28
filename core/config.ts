import { Block } from './interfaces/block.interface'

export const GENESIS: Block = {
    version: '1.0.0',
    index: 0,
    hash: '0'.repeat(64),
    previousHash: '0'.repeat(64),
    timestamp: 1231006506,
    merkleRoot: '0'.repeat(64),
    data: ['The Times 03/Jan/2009 Chancellor on brink of second bailout for banks'],
}
