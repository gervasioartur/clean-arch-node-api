import { DbSaveSurveyResult } from './db-save-survey-result'
import Mockdate from 'mockdate'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/useCases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

const makeFakeSurveyResultData = (): SurveyResultModel => (
    {
        id: 'any_id',
        accountId: 'any_account_id',
        surveyId: 'any_survey_id',
        question: 'any_question',
        answers: 'any_answer',
        date: new Date()
    }
)

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
        async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResultData()))
        }
    }
    return new SaveSurveyResultRepositoryStub()
}

interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
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
        const surveyResult = makeFakeSurveyResultData()
        await sut.save(surveyResult)
        expect(saveSpy).toHaveBeenCalledWith(surveyResult)
    })

    it('should return a survesyResult on success ', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const surveyResult = await sut.save(makeFakeSurveyResultData())
        expect(surveyResult).toEqual(makeFakeSurveyResultData())
    })

    it('should throw if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })
})