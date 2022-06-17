import { Express } from 'express'
import { cors,bodyParser,contentType } from '../middlewares'

export default (app: Express): void => {
    app.use(contentType)
    app.use(bodyParser)
    app.use(cors)
}  