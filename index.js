require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
//const person = require('./models/person')

const app = express()

let persons = []

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('person', function getId(req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => { next(error) })
})


app.get('/info/', (request, response, next) => {
  Person.find({}).then(results => {
    const amount = results.length
    response.send(`<p>Phonebook has info for ${amount} people </p>
        <p>${new Date()}</p>`)
  }).catch(error => { next(error) })



})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  /*
if (!body.name || !body.number) {
return response.status(400).json({
error: 'Either name or number is missing'
})
}*/
  const person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    persons = persons.concat(savedPerson)
    console.log('Saved: ' + savedPerson)
    response.json(savedPerson)
  })
    .catch(error => { next(error) })

})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    }).catch(error => next(error))


})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
//ensure this is loaded as the last middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
