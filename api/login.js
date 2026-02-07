import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

// Холболтыг save.js шиг найдвартай болгох
async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = await connectToDatabase();
        // АНХААР: save.js-тэй ижил 'cj_travel' нэрийг ашиглана!
        const database = client.db('cj_travel'); 
        const users = database.collection('users');

        const { email, password } = req.body

        // MongoDB-ээс хайх
        const user = await users.findOne({ email, password });

        if (user) {
            // Нууц үгийг хариунаас хасаад, _id-г string болгоно
            const { password: _, ...userWithoutPassword } = user;
            return res.status(200).json({
                ...userWithoutPassword,
                id: user._id.toString() 
            });
        } else {
            // Хэрэв хэрэглэгч олдохгүй бол энд орж ирнэ
            return res.status(401).json({ message: 'Имэйл эсвэл нууц үг буруу байна.' });
        }

    } catch (error) {
        // ... алдаа барих хэсэг ...
    }
