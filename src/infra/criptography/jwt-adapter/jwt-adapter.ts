import jwt from "jsonwebtoken"
import { Encrypter, Decrypter } from "./jwt-adapter-protocols"
export class JwtAdapter implements Encrypter, Decrypter {
    constructor (private readonly secret: string) {}
    
    async encrypt (value: string): Promise<string> {
        const accesToken = await jwt.sign({ id: value }, this.secret)
        return accesToken
    }

    async decrypt (token: string): Promise<any> {
        const value: any = await jwt.verify(token, this.secret)
        return value
    }
}