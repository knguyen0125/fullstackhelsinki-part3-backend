require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

// Configure morgan logging
morgan.token('post-content', (req, res) => {
  if (req.method == 'POST') return JSON.stringify(req.body);
  return ' ';
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-content',
  ),
);

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '123456',
//     id: 1,
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3,
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4,
//   },
// ];

app.get('/api/persons', (req, res) => {
  //   res.json(persons);
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  //   const id = Number(req.params.id);
  //   const person = persons.find((n) => n.id == id);
  //   if (!person) {
  //     res.status(404).end();
  //   } else {
  //     res.json(person);
  //   }

  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res) => {
  res.send(
    `
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>
    `,
  );
});

app.delete('/api/persons/:id', (req, res, next) => {
  //   const id = Number(req.params.id);
  //   persons = persons.filter((person) => person.id !== id);
  //   res.status(204).end();

  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

// const generateId = () => {
//   return Math.floor(Math.random() * 100000000000);
// };

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  //   if (!body.name) {
  //     res.status(400).json({ error: 'name cannot be empty' });
  //   } else if (!body.number) {
  //     res.status(400).json({ error: 'number cannot be empty' });
  //   } else if (
  //     persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())
  //   ) {
  //     res.status(400).json({ error: 'name must be unique' });
  //   } else {
  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId(),
  // };

  // persons = persons.concat(person);

  // res.json(person);

  //   }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message, error.name, error.kind);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
