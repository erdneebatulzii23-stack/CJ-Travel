const { MongoClient } = require('mongodb');

// Таны явуулсан холболтын линк
const uri = "mongodb+srv://erdneebatulzii23_db_user:iArC3sCUm4OafdYD@cluster0cjtraveler.go9ldfp.mongodb.net/?appName=cluster0CJTraveler";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // Вэб сайтаас мэдээлэл ирэх үед
    if (req.method === 'POST') {
        try {
            await client.connect();
            const db = client.db('CJ_Travel_Database'); 
            const collection = db.collection('registrations');
            
            // Ирсэн мэдээллийг MongoDB рүү хадгалах
            const result = await collection.insertOne(req.body);
            
            res.status(200).json({ success: true, id: result.insertedId });
        } catch (e) {
            res.status(500).json({ error: e.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).send('Зөвхөн POST хүсэлт зөвшөөрөгдөнө');
    }
};
