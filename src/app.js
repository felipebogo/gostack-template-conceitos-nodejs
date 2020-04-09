const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const idx = repositories.findIndex(rep => rep.id === id);

  let ret;

  if (idx < 0) {
    ret = response.status(400).json({ error: `Índice ${id} não encontrado.` })
  } else {
    const { likes } = repositories[idx];
    const rep = { id, title, url, techs, likes };

    repositories[idx] = rep;

    ret = response.json(rep);
  }

  return ret;

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const idx = repositories.findIndex(rep => rep.id === id);

  let ret;

  if (idx < 0) {
    ret = response.status(400).json({ error: `Índice ${id} não encontrado.` })
  } else {
    repositories.splice(idx,1);
    ret = response.status(204).send();
  }

  return ret;
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const idx = repositories.findIndex(rep => rep.id === id);

  let ret;

  if (idx < 0) {
    ret = response.status(400).json({ error: `Índice ${id} não encontrado.` })
  } else {
    const rep = repositories[idx];
    rep.likes++;
    
    repositories[idx] = rep;

    ret = response.json(rep);
  }

  return ret;
});

module.exports = app;
