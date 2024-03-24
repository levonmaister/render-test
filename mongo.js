const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2]

console.log("length of input: ", process.argv.length)

const url = `mongodb+srv://levonmaister:${password}@cluster0.ffmyzl7.mongodb.net/noteApp`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
  })
  
  const Person = mongoose.model('Person', personSchema)
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

if(process.argv.length>3){

    const inputname = process.argv[3]
    const inputnumber = process.argv[4]

  
  const person = new Person({
    name: inputname,
    number: inputnumber
  })

  person.save().then(result => {
    console.log('Person Saved')
    mongoose.connection.close()
  })
  
}
else{
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })


}
