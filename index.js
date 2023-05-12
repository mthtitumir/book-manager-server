require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//mongodb code


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xx7c7ta.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const bookCollection = client.db("bookManager").collection("books");

        //insert a book to db
        app.get("/health", (req, res) => {
            res.send("All is well!")
        })
        app.post('/upload-book', async (req, res) => {
            const data = req.body;
            console.log(body);
            const result = await bookCollection.insertOne(data);
            res.send(result);
        })

        app.get('/all-books', async (req, res) => {
            const books = bookCollection.find();
            const result = await books.toArray();
            res.send(result);
        })

        app.patch('/book/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updatedBookData
                }
            }
            const result = await bookCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })

        app.delete('book/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollection.deleteOne(filter);
            res.send(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//mongodb code


app.get('/', (req, res) => {
    res.send('books are selling')
})
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})