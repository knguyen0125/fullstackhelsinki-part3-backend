const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
  .connect(url, { useNewUrlParser: true })
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB: ', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
  },
});
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
