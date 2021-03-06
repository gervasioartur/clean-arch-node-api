import { mockSurveyModel, mockSurveysModels } from '@/domain/__test__/mock-survey'
import { AddSurveyRepository } from "@/data//protocols/db/survey/add-survey-repository"
import { LoadSurveysByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import { AddSurveyParams, LoadSurveysRepository, SurveyModel } from "@/data//useCases/survey/load-surveys/db-load-surveys/db-load-surveys-protocols"

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add (surveyData: AddSurveyParams): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new AddSurveyRepositoryStub()
}

export const mockLoadSurveysbyIdRepository = (): LoadSurveysByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveysByIdRepository {
        async loadById (id: string): Promise<SurveyModel> {
            return new Promise(resolve => resolve(mockSurveyModel()))
        }
    }
    return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll (): Promise<SurveyModel []> {
            return new Promise(resolve => resolve(mockSurveysModels()))
        }
    }
    return new LoadSurveysRepositoryStub()
}