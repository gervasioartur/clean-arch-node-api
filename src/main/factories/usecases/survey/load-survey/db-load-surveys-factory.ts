import { LoadSurveys, SurveyMongoRepository, DbLoadSurveys } from './db-load-survey-factory-protocols'
export const makeDbLoadSurvey = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)
}