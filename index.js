import morgan from "morgan";
import express from "express";
import cors from "cors"

const app = express();

app.use(express.json());

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use(cors())

app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];


app.get("/api/persons", (request, response) => {
  response.json(persons);
});



app.get("/info", (request, response) => {
  const totalEntries = persons.length;
  const currentDate = new Date();
  return response.send(
    `<p>Phonebook has info for ${totalEntries} people<p><p>${currentDate}</p>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return persons.length > 0 ? Math.floor(Math.random() * 10000) : 0;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or phone is missing" });
  }

  const sameName = persons.find((person) => person.name === body.name);

  if (sameName) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
