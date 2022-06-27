import { DbLoadSurveys } from '@/data/useCases/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveys } from '@/domain/useCases/load-surveys'

export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}