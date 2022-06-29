import { SurveyModel } from "@/domain/models/survey";
import { AddSurveyParams } from "@/domain/useCases/survey/load-surveys";

export const mockAddSurveyParams = (): AddSurveyParams => (
    {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }
        ],
        date: new Date()
    }
)

export const mockSurveyModel = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }
}

export const mockSurveysModels = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    },
    {
        id: 'any_id',
        question: 'any_question_1',
        answers: [{
            image: 'any_image',
            answer: 'any_answer_1'
        }],
        date: new Date()
    }
]
}