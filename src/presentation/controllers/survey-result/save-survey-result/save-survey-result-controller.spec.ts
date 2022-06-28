import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, LoadSurveyById, SurveyModel, forbidden, InvalidParamError, serverError, SaveSurveyResult,ok } from "./save-survey-result-controller.protocols"
import Mockdate from 'mockdate'
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultParams } from "@/domain/useCases/survey-result/save-survey-result"
import { Collection, ObjectId } from "mongodb"

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: {
        answer: 'any_answer' 
    },
    accountId: 'any_account_id'
})

const makeFakeSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_question',
    date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById (id: any): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return new Promise(resolve => resolve(makeFakeSurveyResultModel()))
        }
    }
    return new SaveSurveyResultStub()
}

interface SutTypes {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSaveSurveyResult()  
    const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub
    }
}

describe('SaveSurveyResultController', () => {
    beforeAll(async () => {
        Mockdate.set(new Date())
    })

    afterAll(async () => {
        Mockdate.reset()
    })

    it('should call  LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toBeCalledWith(makeFakeRequest().params.surveyId)
    })

    it('should return 403 if LoadSurveyById return null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
    })

    it('Should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('should return 403 if an invalid answer is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({
            params: {
                surveyId: 'any_survey_id'
            },
            body: {
                answer: 'wrong_answer' 
            }
        })
        expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
    })

    it('should call  SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
        await sut.handle(makeFakeRequest())
        expect(saveSpy).toBeCalledWith({ surveyId: 'any_survey_id', accountId: 'any_account_id', date: new Date(), answer: 'any_answer' })
    })

    it('Should return 500 if SaveSurveyResult throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('Should return 200 on success', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel()))
    })
})