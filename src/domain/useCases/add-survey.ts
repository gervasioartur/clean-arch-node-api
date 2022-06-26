import { SurveyAnswerModel } from "../models/survey"

export interface AddSurveyModel {
    id?: any
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

export interface AddSurvey {
    add(account: AddSurveyModel): Promise<void>
}
