import { MongoHelper, LogErrorRepository } from './log-mong-repository-protocols'

export class LogMongoRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection('erros')
        await errorCollection.insertOne({
            stack,
            date: new Date()
        })
    }
} 