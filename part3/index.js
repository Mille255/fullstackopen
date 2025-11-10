require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))  
app.use(express.json())

// Custom Morgan tokens
morgan.token('custom-name', (req) => (req.body && req.body.name) ? req.body.name : 'no-name')
morgan.token('custom-number', (req) => (req.body && req.body.number) ? req.body.number : 'no-number')

app.use(morgan('tiny'))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms {"name":":custom-name","number":":custom-number"}')
);


app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend is running</h1>');
});


app.get('/info', (request, response) => {
  const currentTime = new Date();
  Person.countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `);
    })
    .catch(error => {
      console.error(error);
      response.status(500).send('Error fetching info');
    });
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
   })
})

  
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

 
  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
      }
   
    const person = new Person({
    name: body.name,
    number: body.number,
    })

    person.save() 
        .then(savedPerson =>{ response.json(savedPerson)
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  // Validaatio: molempien pitää olla annettuja
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(
    request.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' } // tärkeää validointia varten
  )
    .then(result => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end(); // id:tä ei löytynyt
      }
    })
    .catch(next);
});


// Error handling middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})