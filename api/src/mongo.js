import config from '../config/main.js'

import { MongoClient } from 'mongodb'

const client = new MongoClient(config.dbs.mongo.uri)

const connection = await client.connect()

const db = client.db(config.dbs.mongo.db)

export { db, connection, client }