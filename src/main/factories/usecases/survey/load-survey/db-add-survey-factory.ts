import { DbLoadSurveys } from '../../../../../data/useCases/load-surveys/db-load-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveys } from '../../../../../domain/useCases/load-survey'

export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}