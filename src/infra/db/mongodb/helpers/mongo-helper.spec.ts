import { MongoHelper as sut } from "./mongo-helper"

describe('MongoHel[er', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await sut.disconnect()
    })

    it('should reconnect if mongoDB i down', async () => {
        let accountColletion = await sut.getCollection('accounts')
        expect(accountColletion).toBeTruthy()
        await sut.disconnect()
        accountColletion = await sut.getCollection('accounts')
        expect(accountColletion).toBeTruthy()
    })
})