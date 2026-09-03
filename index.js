//First method learn, without using a database

/*


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


*/

//Second method learn, using database

import morgan from "morgan";
import express from "express";
import cors from "cors";
import Person from "./models/person.js";

const app = express();

app.use(express.json());

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.use(cors());

app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((totalEntries) => {
    const currentDate = new Date();

    return response.send(
      `<p>Phonebook has info for ${totalEntries} people</p><p>${currentDate}</p>`,
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        return response.json(person);
      }
      return response.status(404).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or phone is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  let person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    returnDocument: "after",
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        return response.json(updatedPerson);
      }

      return response.status(404).json({ error: "Person not found" });
    })

    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
