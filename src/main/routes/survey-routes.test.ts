import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { app } from '../config/app'
import { Collection } from 'mongodb'

describe('Login routes', () => {
  let surveyColletion: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys')
    await surveyColletion.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('should return 204 on add surveys success', async () => {
      const respo = await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              image: 'image.png',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 1'
            }
          ]
        }
        )
        .expect(204)
    })
  })
})  