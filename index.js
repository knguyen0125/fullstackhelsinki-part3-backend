const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());
morgan.token('post-content', (req, res) => {
  if (req.method == 'POST') return JSON.stringify(req.body);
  return ' ';
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-content',
  ),
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '123456',
    id: 1,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((n) => n.id == id);
  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.send(
    `
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>
    `,
  );
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  // const person = persons.find(n => n.id == id)
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 100000000000);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({ error: 'name cannot be empty' });
  } else if (!body.number) {
    res.status(400).json({ error: 'number cannot be empty' });
  } else if (
    persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())
  ) {
    res.status(400).json({ error: 'name must be unique' });
  } else {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };

    persons = persons.concat(person);

    res.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
