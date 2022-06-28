import { DbLoadSurveyById } from '@/data/useCases/survey/load-surveys/db-load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveyById } from '@/domain/useCases/survey/load-surveys-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveyById(surveyMongoRepository)
}