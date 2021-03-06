import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from './survey-mong-repository-protocols'

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

describe('Survey Mongo repo', () => {
    let surveyColletion: Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL || '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyColletion = await MongoHelper.getCollection('surveys')
        await surveyColletion.deleteMany({})
    })

    describe('Add()', () => {
        it('should add asurvey on success', async () => {
            const sut = makeSut()
            await sut.add({
                question: 'any_question',
                answers: [
                    {
                        image: 'any_image',
                        answer: 'any_answer'
                    },
                    {
                        answer: 'any_answer_2'
                    }
                ],
                date: new Date()
            })
            const survey = await surveyColletion.findOne({ question: 'any_question' })
            expect(survey).toBeTruthy()
        })
    })

    describe('LaodAll()', () => {
        it('should load survey on success', async () => {
            const res = await surveyColletion.insertMany([
                {
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        },
                        {
                            answer: 'any_answer_2'
                        }
                    ],
                    date: new Date()
                },

                {
                    question: 'any_question_1',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        },
                        {
                            answer: 'any_answer_2'
                        }
                    ],
                    date: new Date()
                }
            ])

            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0].question).toBe('any_question')
            expect(surveys[1].question).toBe('any_question_1')
            expect(surveys[1].id).toEqual(res.insertedIds[1])
        })

        it('should load survey empty list', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })

    describe('LaodById)', () => {
        it('should load by id survey on success', async () => {
            const res = await surveyColletion.insertOne(
                {
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        },
                        {
                            answer: 'any_answer_2'
                        }
                    ],
                    date: new Date()
                }
            )
            
            const sut = makeSut()
            const survey = await sut.loadById(res.insertedId)
            expect(survey).toBeTruthy()
            expect(survey.id).toEqual(res.insertedId)
        })
    })
})