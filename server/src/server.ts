import app from './'
import dotenv from 'dotenv'

dotenv.config()
// Start Express server.
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`)
})

export default server
