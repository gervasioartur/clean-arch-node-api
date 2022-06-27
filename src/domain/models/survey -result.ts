export interface SurveyAnswerModel {
    image?: string
    answer: string
}

export interface SurveyResultModel {
    id: string
    surveyId: string
    accountId: string
    question: string
    answers: string
    date: Date
}
