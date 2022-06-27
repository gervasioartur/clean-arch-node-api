import { SurveyModel, LoadSurveysController, LoadSurveys, noContent, serverError, ok } from './load-surveys-controller-protocols'
import Mockdate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }]
}

interface SutTypes {
    sut: LoadSurveysController
    loadSurveysStub: LoadSurveys
}

const makeLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load (): Promise<SurveyModel[]> {
            return new Promise(resolve => resolve(makeFakeSurveys()))
        }
    }
    return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)
    return {
        sut,
        loadSurveysStub
    }
}

describe('', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    beforeAll(() => {
        Mockdate.reset()
    })

    it('should  call load surveys', async () => {
        const { sut, loadSurveysStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysStub, 'load')
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })

    it('should  return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(makeFakeSurveys()))
    })

    it('should  return 204 if LaodSurveys returns empty', async () => {
        const { sut, loadSurveysStub } = makeSut()
        const addSpy = jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    })

    it('Should return 500 if AddSurvey throws', async () => {
        const { sut, loadSurveysStub } = makeSut()
        const addSpy = jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})  