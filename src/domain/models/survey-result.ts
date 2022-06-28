export interface SurveyAnswerModel {
    image?: string
    answer: string
}

export interface SurveyResultModel {
    id?: string
    surveyId: string
    accountId: string
    question?: string
    answer: string
    date: Date
}
