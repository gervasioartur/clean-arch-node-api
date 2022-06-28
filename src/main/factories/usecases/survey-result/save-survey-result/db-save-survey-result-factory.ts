import { SurveyResultMongoRepository, DbSaveSurveyResult, SaveSurveyResult } from './db-save-survey-result-factory-protocols'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    return new DbSaveSurveyResult(surveyResultMongoRepository)
}