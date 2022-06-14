import { MissingParamError } from "../../../presentation/errors";
import { badRequest } from "../../../presentation/helpers/http-helper";
import { resolve } from "path";
import { Controller, HttpRequest, HttpResponse } from "../../protocols/";

export class LoginController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
}