import { SurveyModel } from "../models/survey";

export interface LoadSurveyById {
    loadById(id: any): Promise<SurveyModel>
}
