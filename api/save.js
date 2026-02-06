import { MongoClient } from 'mongodb';

// Vercel-ийн Environment Variable-аас линкийг уншина
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await client.connect();
            // Чиний баазын нэр: CJ_Travel_Database
            const db = client.db('CJ_Travel_Database'); 
            const collection = db.collection('registrations');
            
            // Хэрэв дата string хэлбэрээр ирвэл JSON болгож хувиргах
            const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            
            const result = await collection.insertOne(data);
            
            res.status(200).json({ success: true, id: result.insertedId });
        } catch (e) {
            console.error("Алдаа гарлаа:", e);
            res.status(500).json({ error: e.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).send('Зөвхөн POST хүсэлт зөвшөөрөгдөнө');
    }
}
