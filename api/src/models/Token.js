import { db } from '../mongo.js'
import { ObjectId } from 'mongodb'

const dbCollection = db.collection('token')

const create = async (data) =>
  (await dbCollection.insertOne(data)).insertedId.toString()

const updateOne = async (filter, data) =>
  dbCollection.updateOne(filter, { $set: { ...data } })

const updateMany = async (filter, data) =>
  dbCollection.updateMany(filter, { $set: { ...data } })

const find = async (filter) =>
  dbCollection.find(filter).toArray()

const findById = async (id, options = {}) =>
  dbCollection.findOne(ObjectId(id), options)

const updateById = async (id, data) =>
  dbCollection.findOneAndUpdate({ _id: ObjectId(id) }, { $set: { ...data } })


export { create, updateOne, updateMany, updateById, find, findById }