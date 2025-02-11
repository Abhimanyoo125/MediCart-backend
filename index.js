const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const setupSwagger = require('./swaggerSetup');

const app = express();
const port = 3000;
app.use(express.json());
setupSwagger(app);

// MongoDB connection URL
const url = "mongodb+srv://abhimanyoovjoshi:Manubal1@backenddb.ecott.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB";

/**
 * @swagger
 * /data/query/findall/{dbname}/{collectionName}:
 *   get:
 *     summary: Retrieve all documents
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     responses:
 *       200:
 *         description: A list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/data/query/findall/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const documents = await collection.find({}).toArray();
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching documents');
    } finally {
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/findselection/{dbname}/{collectionName}:
 *   post:
 *     summary: Retrieve documents based on query conditions
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: A list of documents matching the query conditions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.post('/data/query/findselection/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const queryConditions = req.body;
        console.log("Query conditions:", queryConditions);

        const documents = await collection.find(queryConditions).toArray();
        // console.log("Documents retrieved:", documents);
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send('Error fetching documents');
    } finally {
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/insertone/{dbname}/{collectionName}:
 *   post:
 *     summary: Insert a single document
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Document inserted successfully
 */
app.post('/data/query/insertone/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const document = {
            ...req.body,createdAt : new Date()};
        console.log("Inserting Document : ", document);

        await collection.insertOne(document);
        res.status(201).send('Document inserted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting document');
    } finally {
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/insertmany/{dbname}/{collectionName}:
 *   post:
 *     summary: Insert multiple documents
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *     responses:
 *       201:
 *         description: Documents inserted successfully
 */
app.post('/data/query/insertmany/:dbname/:collectionName', async (req,res)=>{
    const {dbname,collectionName}=req.params;
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);
        const documents = req.body.map(doc =>({
            ...doc, createdAt : new Date()
        }));
        console.log("Inserting documents : ", documents);
        await collection.insertMany(documents);
        res.status(201).send('Documents inserted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error inserting documents");
    }finally{
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/updateone/{dbname}/{collectionName}:
 *   put:
 *     summary: Update a single document
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Error - _id is required in the request body
 */
app.put('/data/query/updateone/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const {_id, ...updateData} = req.body;

        if(!_id){
            return res.status(400).send('Error : _id is required in the request body');
        }
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            {$set : {...updateData, updatedAt : new Date()}}
        );

        if (result.matchedCount === 0) {
            res.status(404).send('Document not found');
        } else {
            res.status(200).send('Document updated successfully');
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send('Error updating document');
    } finally {
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/updatemany/{dbname}/{collectionName}:
 *   put:
 *     summary: Update multiple documents
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 description: Filter criteria to select documents
 *               updateData:
 *                 type: object
 *                 description: Data to update the selected documents
 *     responses:
 *       200:
 *         description: Documents updated successfully
 *       400:
 *         description: Error - Both filter and updateData are required in the request body
 */
app.put('/data/query/updatemany/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const { filter, updateData } = req.body;

        if (!filter || !updateData) {
            return res.status(400).send('Error: Both filter and updateData are required in the request body');
        }

        const result = await collection.updateMany(
            filter,
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            res.status(404).send('No documents matched the filter');
        } else {
            res.status(200).send(`${result.modifiedCount} documents updated successfully`);
        }
    } catch (error) {
        console.error("Error updating documents:", error);
        res.status(500).send('Error updating documents');
    } finally {
        await client.close();
    }
});

/**
 * @swagger
 * /data/query/deleteone/{dbname}/{collectionName}:
 *   delete:
 *     summary: Delete a single document
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       400:
 *         description: Error - _id is required in the request body
 */
app.delete('/data/query/deleteone/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).send('Error: _id is required in the request body');
        }

        const result = await collection.deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) {
            res.status(404).send('Document not found');
        } else {
            res.status(200).send('Document deleted successfully');
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).send('Error deleting document');
    } finally {
        await client.close();
    }
});


/**
 * @swagger
 * /data/query/deletemany/{dbname}/{collectionName}:
 *   delete:
 *     summary: Delete multiple documents
 *     parameters:
 *       - in: path
 *         name: dbname
 *         required: true
 *         schema:
 *           type: string
 *         description: Database name
 *       - in: path
 *         name: collectionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Collection name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Documents deleted successfully
 *       400:
 *         description: Error - filter is required in the request body
 */
app.delete('/data/query/deletemany/:dbname/:collectionName', async (req, res) => {
    const { dbname, collectionName } = req.params;
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbname);
        const collection = db.collection(collectionName);

        const { filter } = req.body;

        if (!filter) {
            return res.status(400).send('Error: filter is required in the request body');
        }

        const result = await collection.deleteMany(filter);

        if (result.deletedCount === 0) {
            res.status(404).send('No documents matched the filter');
        } else {
            res.status(200).send(`${result.deletedCount} documents deleted successfully`);
        }
    } catch (error) {
        console.error("Error deleting documents:", error);
        res.status(500).send('Error deleting documents');
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});