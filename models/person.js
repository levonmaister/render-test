const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("Connecting to ", url)

mongoose.connect(url)
    .then(result=>{
        console.log("Connected to MongoDB")
    })
    .catch((error)=>{
        console.log("error connecting to MongoDB", error.message)
    })

    function validatePhoneNumber(phoneNumber) {
      // Regular expression to match the phone number format
      const phoneNumberRegex = /^\d{2,3}-\d+$/
      return phoneNumberRegex.test(phoneNumber)
    }
    

const personSchema = new mongoose.Schema({
    name: {type: String,
            minLength: 3,
            required: true},
    number: {
      type: String,
      required: true,
      validator: validatePhoneNumber,
      message: "Invalid phone number"}
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  
module.exports = mongoose.model('Person', personSchema)


