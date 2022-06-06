import 'dotenv/config'
import { app } from './config/app'

const port =  process.env.PORT
app.listen(port, () => console.log('Server running at http://localhost:'+port))