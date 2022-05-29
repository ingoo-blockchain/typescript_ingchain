import elliptic, { curve } from 'elliptic'
import SHA256 from 'crypto-js/sha256'
import { randomBytes } from 'crypto'
import { publicKeyConvert } from 'secp256k1'
import createKeccakHash from 'keccak'
import { toChecksumAddress } from 'ethereum-checksum-address'
import { getAddress } from '@ethersproject/address'

const ec = new elliptic.ec('secp256k1')
// 참고 URL : https://brunch.co.kr/@nujabes403/13
// 수학잘하는 사람만 ^^..

describe.only('지갑개념 이해하기', () => {
    let privKey: string, pubKey: string, address: string, publicKey: curve.base.BasePoint
    it('비밀키(private key) 생성하기', () => {
        privKey = randomBytes(32).toString('hex')
        console.log(privKey)
    })

    it('공개키(public key) 생성하기', () => {
        const keyPair = ec.keyFromPrivate(privKey)
        publicKey = keyPair.getPublic()

        const pubKeyX = publicKey.getX().toString('hex')
        const pubKeyY = publicKey.getY().toString('hex')
        console.log('public key : ', publicKey) // 원본데이터.
        console.log('X 좌표:', pubKeyX) // 32byte
        console.log('Y 좌표:', pubKeyY) // 32byte

        pubKey = publicKey.encode('hex', true)
        console.log(pubKey)

        //console.log('public  : ', publicKey.encodeCompressed('hex'))
    })

    it('서명(Signing) 하기 ', () => {
        const data = '트랜잭션에 들어갈 내용이라고 가정'
        const hash = SHA256(data).toString() // 트랜잭션 hash

        console.log(data, hash)

        // 서명하기
        // R(Rx,Ry) = randomNumber * GPoint
        // r = Rx
        // s = (r * PrivKey + hash) / randomNumber
        const signature = ec.sign(hash, ec.keyFromPrivate(privKey, 'hex'), 'hex')
        console.log('서명 : ', signature)
        const r = signature.r.toString(16)
        const s = signature.s.toString(16)

        console.log('r:', r)
        console.log('s:', s)
        const verify = ec.verify(hash, signature, ec.keyFromPublic(pubKey, 'hex'))
        console.log(`verify : ${verify}`)
    })

    it('주소(address) or 계정(account) 만들기 ', () => {
        
        const buffer = Buffer.from(pubKey)
        console.log(buffer.slice(20).toString(), pubKey)
        
    })
})
