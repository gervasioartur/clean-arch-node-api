import { Controller, LogControllerDecorator, LogMongoRepository } from './log-controller-decorator-factory-protocols'

export const makeLogControllerDecorator = (controler: Controller): Controller => {
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(controler, logMongoRepository)
}