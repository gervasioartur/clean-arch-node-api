import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { Authentication, AuthenticationModel } from '../../../domain/useCases/authentication'

export class DbAuthentication implements Authentication {
    constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth (authentication: AuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null
    }
}