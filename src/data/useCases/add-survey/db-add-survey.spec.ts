import { AddSurvey, AddSurveyModel } from '@/domain/useCases/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'
import Mockdate from 'mockdate'

const makeFakeSurveyData = (): AddSurveyModel => (
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
        async add (surveyData: AddSurveyModel): Promise<void> {
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

    beforeAll(() => {
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
        jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeSurveyData())
        await expect(promise).rejects.toThrow()
    })
})