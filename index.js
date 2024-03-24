console.log("Working")
const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('dist'))
app.use(cors())





morgan.token('body', (req, res) => JSON.stringify(req.body));


app.use(express.json())

app.use(morgan(':method :url :status :total-time[3] - :response-time[3] ms :body'))





app.get('/api/persons', (request, response) => {
    Person.find({}).then(person=>{
      response.json(person)
    })
  })
  
app.get('/info', (request, response) => {
  
    Person.find({}).then(person => {
      console.log("person list has ", person.length)
      
       
    
    const currentDate = new Date()

    const options = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    }

    const formattedDate = currentDate.toLocaleString('en-US', options);

    const message = "<p>Phonebook has info for " + person.length + " people <br/>" + formattedDate + "</p>"
    response.send(message)

  }) 
  })

  app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id).then(person =>{
      if(person){
      response.json(person)
      }
      else{response.status(404).end()}
    })
    .catch(error=>next(error))
  })


  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
  })

  app.put('/api/persons/:id',(request,response,next)=>{

    const body = request.body
    console.log("Got ", body)
    const {name, number} = request.body


    
    Person.find({}).then(person=>{
    const ExistingPerson = person.find(person=> person.name === body.name)
    console.log("Existing Person object" , ExistingPerson)
    if (ExistingPerson) {
    console.log("Person already exists")
  const ExistingPersonId = ExistingPerson._id.toString()

  Person.findByIdAndUpdate(ExistingPersonId, {number, name}, {new: true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
    console.log("Updated person ", updatedPerson)
    response.json(updatedPerson)
  })
  .catch(error=>next(error))
    }

  })
})


  app.post('/api/persons', (request, response, next) => {

    const body = request.body
    let id = ''
    console.log("Got ", body)
    

    const {name, number} = request.body
    // Frontend Shit
    Person.find({}).then(person=>{
      if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
      else if (!body.number) {
          return response.status(400).json({ 
            error: 'number missing' 
          })
        }

        const ExistingPerson = person.find(person=> person.name === body.name)
        console.log("Existing Person object" , ExistingPerson)
        if (ExistingPerson) {
        console.log("Person already exists")
      const ExistingPersonId = ExistingPerson._id.toString()

      Person.findByIdAndUpdate(ExistingPersonId, {number, name}, {new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
        console.log("Updated person ", updatedPerson)
        response.json(updatedPerson)
      })
      .catch(error=>next(error))
        }
    else{
      console.log("Creating new person")
      const id = Math.floor((Math.random() * 1000000) + 1)
  
    
  // MONGODB POST
  
      const personMongo = new Person({
        id: id,
        name: body.name,
        number: body.number
      })
  
      personMongo.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(error=>next(error))

    }

    })
  
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if(error.name==='ValidationError'){
      return response.status(400).json({error: error.message})
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)



const PORT =  process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
