import { LoadSurveyById } from '@/domain/useCases/load-surveys-by-id'
import { MongoHelper, AddSurveyRepository, AddSurveyModel, LoadSurveysRepository, SurveyModel } from './survey-mong-repository-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        await surveyColleaction.insertOne(surveyData)
    }
    
    async loadAll (): Promise<SurveyModel[]> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        const result = await surveyColleaction.find().toArray()
        const surveys = []
        for (let element of result) {
            element = MongoHelper.map(element)
            surveys.push(element)
        }
        return surveys
    }

    async loadById (id: any): Promise<SurveyModel> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        const survey = await surveyColleaction.findOne({ _id: id })
        return survey ? MongoHelper.map(survey) : null
    }
}
