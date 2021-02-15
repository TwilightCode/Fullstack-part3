const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => { console.log('connected to MongoDB') }).catch((error) => { console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlenght: 3 },
  number: { type: String, required: true, unique: true, minlength: 8 }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.plugin(mongooseUniqueValidator)
module.exports = mongoose.model('Person', personSchema)