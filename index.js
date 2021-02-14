const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express();

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 100,
        name: "Rin Poppendick",
        number: "39-2-6423122"
    }
]

const generateId = () => {
    const id = Math.floor((Math.random() * 1000000000000))
    return id
}
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
/*   app.use(morgan(mor = (tokens, request, response) => {
 return [
tokens.method(request, response),
tokens.url(request,response),
tokens.status(request,response),

 ]
})) */

morgan.token('person', function getId (req) {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        return id === person.id
    })
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.get('/info/', (request, response) => {
    const amount = persons.length        
    response.send(`<p>Phonebook has info for ${amount} people </p>
                   <p>${new Date()}</p>`
    )

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Either name or number is missing'
        })
    }
    if(persons.find(person => person.name === body.name) !== undefined){
        return response.status(400).json({
            error: 'Name exist already'
        }) 
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    console.log(persons);
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons);
    response.status(204).end()
})

const PORT = process.env.PORT ||3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
