require('dotenv').config();
const express = require('express')
require('../db/mongoose')
const cors = require('cors')
const pollRoute = require('../routes/pollRoute')


const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
app.use(pollRoute)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})