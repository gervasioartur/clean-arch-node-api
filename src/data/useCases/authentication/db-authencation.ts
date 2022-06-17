import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { Authentication, AuthenticationModel } from '../../../domain/useCases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-compare';

export class DbAuthentication implements Authentication {
    constructor (
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
    }

    async auth (authentication: AuthenticationModel): Promise<string> {
       const account = await this.loadAccountByEmailRepository.load(authentication.email)
       if (account) {
        await this.hashComparer.compare(authentication.password, account.password)
       }
        return null
    }
}