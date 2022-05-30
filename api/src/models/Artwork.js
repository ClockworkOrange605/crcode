import { db } from '../mongo.js'
import { ObjectId } from 'mongodb'

const dbCollection = db.collection('artworks')

const create = async (data) => {
  const query = await dbCollection.insertOne(data)
  return query.insertedId.toString()
}

const find = async (id) =>
  dbCollection.findOne(ObjectId(id))

const update = async (id, data) =>
  dbCollection.findOneAndUpdate(ObjectId(id), { $set: { ...data } })

export { create, find, update }