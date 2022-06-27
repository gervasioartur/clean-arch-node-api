import { LoadSurveysByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import Mockdate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'

const makeFakeSurvey = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }
}

const makeLoadSurveysbyIdRepository = (): LoadSurveysByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveysByIdRepository {
        async loadById (id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdRepositoryStub()
}

interface SutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveysByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveysbyIdRepository()
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

    beforeAll(() => {
        Mockdate.reset()
    })

    it('should call LoadSurveysByIdRepository ', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadById('any_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })
})