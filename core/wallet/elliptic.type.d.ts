declare module 'elliptic' {
    class EllipticCurve {
        constructor(preset: 'secp256k1')
        genKeyPair(): this
        keyFromPublic(publicKey: string, hex: 'hex'): this
        getPublic(): {
            encode(hex: string, bool: boolean): string
        }
        getPrivate(): {
            encode(hex: string): string
            toString(num: number): string
        }
        getPublicKey(hex: string, compressed: string): string
        keyFromPrivate(privKey: string): this
        sign(data: any): any
        verify(data: string, {}): boolean
    }

    export { EllipticCurve as ec }
}
