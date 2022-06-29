import { AddSurveyParams, AddSurveyRepository, AddSurvey } from './db-add-survey-protocols'
export class DbAddSurvey implements AddSurvey {
    constructor ( 
        private readonly addSurveyRepository: AddSurveyRepository
    ) { }

    async add (surveyData: AddSurveyParams): Promise<void> {
        await this.addSurveyRepository.add(surveyData)
        return new Promise(resolve => resolve())
    }
}