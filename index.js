const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT||5000

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('my TaskManager server is running')
})


const uri = `mongodb+srv://${process.env.APP_USER}:${process.env.APP_PASSWORD}@cluster0.ex1o8oo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const taskCollection = client.db('myTaskManagerDb').collection('allTasks')


        // app.get('/allTask', async(req, res) => {
        //     const query = {}
        //     const allTask = await taskCollection.find(query).toArray()
        //     res.send(allTask)
        // })

        app.get('/allTask',  async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const tasks = await taskCollection.find(query).toArray()
            res.send(tasks)
        })

        app.post('/allTask', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        app.put('/allTask/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    isComplete: true
                },
            };
            const updateResult = await taskCollection.updateOne(filter, updateDoc, options)
            res.send(updateResult)
        })

        app.patch('/completeTask/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    isComplete: false
                },
            };
            const updateResult = await taskCollection.updateOne(filter, updateDoc)
            res.send(updateResult)
        })

        app.delete('/allTask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id)}
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })
        
    }
    finally {

    }
}
run().catch(error => console.log(error))






app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})