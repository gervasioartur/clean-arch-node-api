import {Express}  from 'express'
import { cors } from '../middlewares/cors'
import { bodyParser } from '../middlewares/body-parser'
import { contentType } from '../middlewares/content-type'

export default (app: Express):  void => {
    app.use(contentType)
    app.use(bodyParser)
    app.use(cors)
}  