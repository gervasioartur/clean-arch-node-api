import { AccountModel } from '@/domain/models/Account'
import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient,
    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },
    async disconnect (): Promise<void> {
        await this.client.close()
    },

    getCollection (name: string): Collection {
        return this.client.db().collection(name)
    },
    map: (collection: any): any => {
        const { _id, ...collectionWithOutId } = collection
        return Object.assign({}, collectionWithOutId, { id: _id })
    } 
}
