import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-survey-repository";
import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveys } from "@/domain/useCases/load-survey";

export class DbLoadSurveys implements LoadSurveys {
    constructor ( 
        private readonly LoadSurveys: LoadSurveysRepository 
    ) {}
    async load (): Promise<SurveyModel[]> {
        const surveys = await this.LoadSurveys.loadAll()
        return surveys 
    }
}   