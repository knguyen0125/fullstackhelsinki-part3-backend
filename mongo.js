const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0-4fvte.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

const createPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  });

  person.save().then((res) => {
    console.log(`added ${name} number ${number} to the phonebook`);
    mongoose.connection.close();
  });
};

const getAll = () => {
  console.log('phonebook: ');
  Person.find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
    });
};

if (process.argv[3]) {
  createPerson(process.argv[3], process.argv[4]);
} else {
  getAll();
}
