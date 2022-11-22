import { MongoClient, Collection } from 'mongodb'

let collection: Collection

async function getCollection() {
    if (collection)
        return collection

    const client = await MongoClient.connect(process.env.ATLAS_URI)
    return client.db('messages').collection('messages')
}

export async function getMessages() {
    const collection = await getCollection()
    return collection.find().toArray()
}

export async function insertMessage(To: string, Body: string, timestamp: number) {
    const collection = await getCollection()
    return collection.insertOne({ To, Body, timestamp })
}