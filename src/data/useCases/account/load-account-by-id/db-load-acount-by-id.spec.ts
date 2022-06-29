import { DbLoadAccountById } from "./load-account-by-id"
import { LoadAccountByIdRepository, AccountModel, mockAccountModel } from './db-load-accout-by-id-protocols'

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
    class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
        async loadById (accountId: any): Promise<AccountModel> {
            return new Promise(resolve => resolve(mockAccountModel()))
        }
    }
    return new LoadAccountByIdRepositoryStub()
}
interface SutTypes {
    sut: DbLoadAccountById
    loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}
const makeSut = (): SutTypes => {
    const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
    const sut = new DbLoadAccountById(loadAccountByIdRepositoryStub)
    return {
        sut,
        loadAccountByIdRepositoryStub
    }
}

describe('DbLoadAccount UseCase', () => {
    it('should call LoadAccountByIdRepository with correct value', async () => {
        const { sut, loadAccountByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
        await sut.load('any_account_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_account_id')
    })

    it('should  return  null on fails', async () => {
        const { sut } = makeSut()
        await sut.load('valid_id')
        const loadSpy = await jest.spyOn(sut, 'load').mockReturnValueOnce(null)
        const account = await sut.load('valid_id')
        expect(account).toBeFalsy()
    })

    it('should  return  an account on succes', async () => {
        const { sut } = makeSut()
        await sut.load('valid_id')
        const account = await sut.load('valid_id')
        expect(account).toEqual(mockAccountModel())
    })
})
