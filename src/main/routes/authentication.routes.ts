import { Router } from "express";
import { adaptRoute } from "../adapters/express-routes-adapter";
import { makeLoginController } from "@/main/factories/controllers/authentication/login/login-controller-factory";
import { makeSingUpController } from "@/main/factories/controllers/authentication/singup/singup-controller-factory"

export default (router: Router): void => {
    router.post('/singup', adaptRoute(makeSingUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}