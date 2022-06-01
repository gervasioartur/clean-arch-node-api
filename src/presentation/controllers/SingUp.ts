export class SingUpController {
    handle (httpResquest: any): any {
        if (!httpResquest.body.name) {
            return {
                statusCode: 400,
                body: new Error('Missing param : name')
            }
        }

        if (!httpResquest.body.email) {
            return {
                statusCode: 400,
                body: new Error('Missing param : email')
            }
        }
    }
}
