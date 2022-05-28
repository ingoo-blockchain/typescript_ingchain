import { jsonToString, createHash, getTimestamp, getMerkleRoot } from '../index'
import { Block, IBlock } from '../../interfaces/block.interface'

class Person {
    public id: string
    public name: string
    constructor(_id: string, _name: string) {
        this.id = _id
        this.name = _name
    }
}

it('JSON 에서 String 테스트', () => {
    const node1 = new Person('web7722', 'ingoo')
    const node2 = new Person('web7722', 'ingoo')
    expect(jsonToString<Person>(node1)).toEqual(jsonToString<Person>(node2))
})

it('getTimestamp 테스트', () => {
    const timestamp = getTimestamp()
    expect(typeof timestamp).toEqual('number')
})

it('merkle 테스트', () => {
    const data: string[] = ['hello world']
    const merkleRoot = getMerkleRoot(data)
    expect(merkleRoot.length).toEqual(64)
})

it('SHA256 해시 출력 테스트', () => {
    const body: string[] = ['hello world']
    const data: IBlock = {
        version: '1.0.0',
        index: 1,
        previousHash: '0'.repeat(64),
        timestamp: 0,
        merkleRoot: 'B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9',
    }
    const hash = createHash(data)
    expect(hash).toEqual('6c2190c45ffb65c74ce6a9b88a01d7d27ab53ed47da6e2dacf679688fec977a7')
})
