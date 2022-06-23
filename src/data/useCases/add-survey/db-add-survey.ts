import { AddSurvey, AddSurveyModel } from '../../../domain/useCases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
    return new Promise(resolve => resolve())
  }
}