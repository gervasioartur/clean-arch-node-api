import { LoadSurveysRepository, SurveyModel, LoadSurveys } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
    constructor ( 
        private readonly LoadSurveys: LoadSurveysRepository 
    ) {}
    async load (): Promise<SurveyModel[]> {
        const surveys = await this.LoadSurveys.loadAll()
        return surveys 
    }
}   