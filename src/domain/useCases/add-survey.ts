import { type } from "os"
import { SurveyModel } from "../models/survey"

export type AddSurveyModel = Omit<SurveyModel, 'id'>
export interface AddSurvey {
    add(account: AddSurveyModel): Promise<void>
}
