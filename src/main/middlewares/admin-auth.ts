import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/middleware/auth-middleware";

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))