import { DbLoadSurveyById, LoadSurveyById, SurveyMongoRepository } from './db-load-survey-by-id-factory-protocols'
export const makeDbLoadSurveyById = (): LoadSurveyById => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveyById(surveyMongoRepository)
}