import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { app } from '../config/app'

describe('Sing up routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountsColletion = await MongoHelper.getCollection('accounts')
    await accountsColletion.deleteMany({})
  })

  it('should return an account on sucess', async () => {
    const respo = await request(app)
      .post('/api/singup')
      .send({
        name: 'usuario test',
        email: 'usuario@test.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})  