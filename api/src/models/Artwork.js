import { db } from '../mongo.js'
import { ObjectId } from 'mongodb'

const dbCollection = db.collection('artworks')

const create = async (data) => {
  const query = await dbCollection.insertOne(data)
  return query.insertedId.toString()
}

const find = (id) =>
  dbCollection.findOne(ObjectId(id))

export { create, find }