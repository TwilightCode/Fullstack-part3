const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstacker:${password}@cluster0.ihono.mongodb.net/person-app?retryWrites=true`

/*
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
if (process.argv.length === 4) {
    const note = new Note({
        content: 'HTML is Easier',
        date: new Date(),
        important: true,
    })

    note.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
} else {
    mongoose.connection.close()
}
*/
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({

    name: String,
    number: String


})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 5) {
    const person = new Person({

        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    console.log("printing")
    Person.find({}).then(result => {
        result.forEach(person => {

            console.log(person)
        })
        mongoose.connection.close()
    })
}else{
    mongoose.connection.close()
}