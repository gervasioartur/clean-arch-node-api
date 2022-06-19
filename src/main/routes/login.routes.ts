import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-routes-adapter";
import { makeLoginController } from "../factories/login/login-factory";
import { makeSingUpController } from '../factories/singup/singup-factory'

export default (router: Router): void => {
    router.post('/singup', adaptRoute(makeSingUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}