import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    try {
        const client = await connectToDatabase();
        const db = client.db("cj_travel"); // Нэрийг нь ижилсүүлэв
        const collection = db.collection("posts");

        if (req.method === 'GET') {
            const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
            return res.status(200).json(posts);
        }

        if (req.method === 'POST') {
            const newPost = {
                ...req.body,
                likes: [],
                comments: [],
                createdAt: new Date()
            };
            const result = await collection.insertOne(newPost);
            return res.status(201).json(result);
        }

        if (req.method === 'PATCH') {
            const { id } = req.query;
            const { userId } = req.body;
            if (!id) return res.status(400).json({ error: "ID required" });
            
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $addToSet: { likes: userId } }
            );
            return res.status(200).json({ success: true });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
}
