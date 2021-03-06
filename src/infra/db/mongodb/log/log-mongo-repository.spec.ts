import { Collection } from 'mongodb'
import { LogMongoRepository } from "./log-mongo-repository"
import { MongoHelper } from './log-mongo-repository-protocols'

describe('Log Mongo Repository', () => {
    let errorCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('erros')
        await errorCollection.deleteMany({})
    })

    it('should create an error log on success', async () => {
        const sut = new LogMongoRepository()
        await sut.logError('any_error')
        const count = await errorCollection.countDocuments()
        expect(count).toBe(1)
    })
})   