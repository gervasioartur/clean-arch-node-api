import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, LoadSurveyById, SurveyModel, forbidden, InvalidParamError, serverError } from "./save-survey-result-controller.protocols"
import Mockdate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
})

const makeFakeSurvey = (): SurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
}
)

const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadById (id: any): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

interface SutTypes {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)

    return {
        sut,
        loadSurveyByIdStub
    }
}

describe('SaveSurveyResultController', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
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
})