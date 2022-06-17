import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/Account'
import { DbAuthentication } from './db-authencation'

describe('DbAuthentication useCase', () => {
    it('should call loadAccountByEmailRepository with correct email',async () => { 
        class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
            async load (email: string): Promise<AccountModel> {
                const account: AccountModel = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email@email.com',
                    password: 'any_password'
                }
                return new Promise(resolve => resolve(account))
            }
        }

        const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth({
            email: 'any_email@email.com',
            password: 'any_password'
        })

        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    }) 
})