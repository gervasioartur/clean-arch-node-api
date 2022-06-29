import Mockdate from 'mockdate'
import { DbAddSurvey } from './db-add-survey'
import { AddSurveyParams, AddSurveyRepository, AddSurvey, throwError } from './db-add-survey-protocols'

const makeFakeSurveyData = (): AddSurveyParams => (
    {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }
        ],
        date: new Date()
    }
)

const makeAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add (surveyData: AddSurveyParams): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new AddSurveyRepositoryStub()
}

interface SutTypes {
    sut: AddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepository()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
        sut,
        addSurveyRepositoryStub
    }
}

describe('DbAddSurvey UseCase', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    afterAll(() => {
        Mockdate.reset()
    })
    
    it('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const surveyData = makeFakeSurveyData()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    it('should throw if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
        const promise = sut.add(makeFakeSurveyData())
        await expect(promise).rejects.toThrow()
    })
})