import { LoadSurveysByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyModel } from "@/domain/models/survey";
import { LoadSurveyById } from "@/domain/useCases/load-surveys-by-id";

export class DbLoadSurveyById implements LoadSurveyById {
    constructor ( 
        private readonly loadSurveyByIdRepositoey: LoadSurveysByIdRepository
    ) {}
    async loadById (id: string): Promise<SurveyModel> {
        await this.loadSurveyByIdRepositoey.loadById(id)
       return null
    }
} 