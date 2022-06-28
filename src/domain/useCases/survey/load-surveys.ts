import { SurveyModel } from "@/domain/models/survey"

export interface SurveyAnswer {
    image?: string
    answer: string
}

export interface AddSurveyParams {
    question: string
    answers: SurveyAnswer[]
    date: Date
}

export interface LoadSurveys {
    load (): Promise<SurveyModel[]>
}
