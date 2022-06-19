import { Router } from "express";
import { makeSingUpController } from '../factories/singup/singup'
import { adaptRoute } from "../adapters/express/express-routes-adapter";

export default (router: Router): void => {
    router.post('/singup', adaptRoute(makeSingUpController()))
}