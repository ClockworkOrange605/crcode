import { db } from '../mongo.js'
import { ObjectId } from 'mongodb'

const dbCollection = db.collection('artworks')

const create = async (data) => {
  const query = await dbCollection.insertOne(data)
  return query.insertedId.toString()
}

const update = async (id, data) =>
  dbCollection.findOneAndUpdate({ _id: ObjectId(id) }, { $set: { ...data } })

const find = async (id) =>
  dbCollection.findOne(ObjectId(id))

//TODO: naming convention
const findAll = async (query) =>
  dbCollection.find({ ...query }).toArray()

export { create, find, update, findAll }