const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [32, 'Name cannot exceed 32 characters']
  },
  slug: {
    type:String,
    unique:true,
    lowercase:true,
    // Helps in querying the database
    // and fetching categories based on slug
    index: true,

  }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)
