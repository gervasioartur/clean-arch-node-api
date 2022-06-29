import Mockdate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveysByIdRepository, throwError, mockLoadSurveysbyIdRepository, mockSurveyModel } from './db-load-survey-by-id-protocols'
interface SutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveysByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = mockLoadSurveysbyIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

describe('DbLoadSurveyById', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
        Mockdate.reset()
    })

    it('should call LoadSurveysByIdRepository ', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadById('any_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })

    it('should return a survesy on success ', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const surveys = await sut.loadById('any_id')
        expect(surveys).toEqual(mockSurveyModel())
    })

    it('should throw if LoadSurveysByIdRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.loadById('any_id')
        await expect(promise).rejects.toThrow()
    })
})