import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel } from '../../../../domain/models/survey'
import { LoadSurveys } from '../../../../domain/useCases/load-survey'
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

describe('', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    beforeAll(() => {
        Mockdate.reset()
    })
    
    it('should  call load surveys', async () => {
        class LoadSurveysStub implements LoadSurveys {
            async load (): Promise<SurveyModel[]> {
                return new Promise(resolve => resolve(makeFakeSurveys()))
            }
        }
        const loadSyrveysStub = new LoadSurveysStub()
        const loadSpy = jest.spyOn(loadSyrveysStub, 'load')
        const sut = new LoadSurveysController(loadSyrveysStub)
        await sut.handle({})
       expect(loadSpy).toHaveBeenCalled()
    })
})  