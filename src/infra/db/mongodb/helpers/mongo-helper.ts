import { MongoClient } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient,
    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(globalThis.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },
    async disconnect (): Promise<void> {
        await this.client.close()
    }
}
