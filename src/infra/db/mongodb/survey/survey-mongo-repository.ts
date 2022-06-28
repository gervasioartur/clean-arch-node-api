import { LoadSurveyById } from '@/domain/useCases/survey/load-surveys-by-id'
import { ObjectId } from 'mongodb'
import { MongoHelper, AddSurveyRepository, AddSurveyModel, LoadSurveysRepository, SurveyModel } from './survey-mong-repository-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        await surveyColleaction.insertOne(surveyData)
    }
    
    async loadAll (): Promise<SurveyModel[]> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        const result = await surveyColleaction.find().toArray()
        return result.length ? MongoHelper.mapCollection(result) : []
    }

    async loadById (id: any): Promise<SurveyModel> {
        const surveyColleaction = await MongoHelper.getCollection('surveys')
        const survey = await surveyColleaction.findOne({ _id: new ObjectId(id) })
        return survey && MongoHelper.map(survey)
    }
}
