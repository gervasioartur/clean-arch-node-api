import { LoadSurveys, DbLoadSurveys, SurveyMongoRepository } from './db-load-surveys-factory-protocols'
export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}