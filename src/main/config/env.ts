import 'dotenv/config'
export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
    port: process.env.PORT || 5000,
    secret: process.env.SECRET || 'axag3@&&)(`´'
} 
