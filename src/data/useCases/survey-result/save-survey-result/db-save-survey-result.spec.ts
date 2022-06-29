import Mockdate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSurveyResult, SaveSurveyResultRepository, mockSaveSurveyResultRepository, throwError } from './db-save-resul-protocols'

interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

describe('DbSaveSurveyResult UseCase', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
        Mockdate.reset()
    })
    
    it('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const surveyResult = mockSurveyResult()
        await sut.save(surveyResult)
        expect(saveSpy).toHaveBeenCalledWith(surveyResult)
    })

    it('should return a survesyResult on success ', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const surveyResult = await sut.save(mockSurveyResult())
        expect(surveyResult).toEqual(mockSurveyResult())
    })

    it('should throw if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
        const promise = sut.save(mockSurveyResult())
        await expect(promise).rejects.toThrow()
    })
})