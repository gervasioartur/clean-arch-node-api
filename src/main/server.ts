import 'module-alias/register'
import env from './config/env'
import { app } from './config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoUrl)
.then(async () => {
    const app = (await import('./config/app')).app 
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
}).catch(error => console.log(error))
