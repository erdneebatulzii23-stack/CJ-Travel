const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await client.connect();
            const db = client.db('CJ_Travel_Database');
            const collection = db.collection('registrations');
            
            // Ирсэн датаг JSON болгох
            const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const result = await collection.insertOne(data);
            
            res.status(200).json({ success: true, id: result.insertedId });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: e.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
