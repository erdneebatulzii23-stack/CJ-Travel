import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI; // Vercel-ийн Settings -> Environment Variables хэсэгт хадгална
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db("social_app");
        const collection = db.collection("posts");

        // 1. Постуудыг татах (GET)
        if (req.method === 'GET') {
            const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
            return res.status(200).json(posts);
        }

        // 2. Шинэ пост хадгалах (POST)
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

        // 3. Лайк дарах (PATCH)
        if (req.method === 'PATCH') {
            const { id } = req.query;
            const { userId } = req.body;
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $addToSet: { likes: userId } } // Давхардахгүйгээр лайк нэмэх
            );
            return res.status(200).json({ success: true });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
