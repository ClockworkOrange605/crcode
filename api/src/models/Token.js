import { db } from '../mongo.js'

const dbCollection = db.collection('token')

const create = async (data) =>
  (await dbCollection.insertOne(data)).insertedId.toString()

const updateOne = async (filter, data) =>
  dbCollection.updateOne(filter, { $set: { ...data } })

const updateMany = async (filter, data) =>
  dbCollection.updateMany(filter, { $set: { ...data } })

const find = async (filter, sort, limit = 0) =>
  dbCollection.find(filter).sort(sort).limit(limit).toArray()

const findById = async (id, options = {}) =>
  dbCollection.findOne({ id }, options)

// const updateById = async (id, data) =>
//   dbCollection.findOneAndUpdate({ id: parseInt(id) }, { $set: { ...data } })


export {
  create, updateOne, updateMany,
  // updateById,
  find, findById
}