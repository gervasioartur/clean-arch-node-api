import { SurveyModel, LoadSurveysByIdRepository, LoadSurveyById } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
    constructor ( 
        private readonly loadSurveyByIdRepositoey: LoadSurveysByIdRepository
    ) {}
    async loadById (id: string): Promise<SurveyModel> {
        const survey = await this.loadSurveyByIdRepositoey.loadById(id)
        return survey
    }
} 