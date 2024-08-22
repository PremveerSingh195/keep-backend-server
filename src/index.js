import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/jokes' , (req,res) => {

 const jokes = [
    {
        "id": 1,
        "joke" : "joke1",
        "description" : "description1"
    },
    {
        "id": 2,
        "joke" : "joke2",
        "description" : "description2"
    },
    {
        "id": 3,
        "joke" : "joke3",
        "description" : "description3"
    },
    {
        "id": 4,
        "joke" : "joke4",
        "description" : "description4"
    },
    {
        "id": 5,
        "joke" : "joke5",
        "description" : "description5"
    }
   ]

    res.send(jokes)
})

app.listen(PORT , () => {
    console.log(`server is running on the port ${PORT}`);
    
})