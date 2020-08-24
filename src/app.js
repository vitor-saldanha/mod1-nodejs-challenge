const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];

//GET ----------------------------------------------------------------
app.get('/repositories', (request, response) => {
	return response.send(repositories);
});

//POST ---------------------------------------------------------------
app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	const project = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0,
	};

	repositories.push(project);

	return response.json(project);
});

// PUT ---------------------------------------------------------------
app.put('/repositories/:id', (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const itemIndex = repositories.findIndex((repo) => repo.id === id);
	if (itemIndex < 0) {
		return response.status(400).json({ error: 'Repository not found.' });
	}

	const { likes } = repositories[itemIndex];
	const newItem = { id, title, url, techs, likes };

	repositories[itemIndex] = newItem;

	return response.json(newItem);
});

//DELETE -------------------------------------------------------------
app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params;

	const itemIndex = repositories.findIndex((repo) => repo.id === id);
	if (itemIndex < 0) {
		return response.status(400).json({ error: 'Repository not found.' });
	}

	repositories.splice(itemIndex, 1);

	return response.status(204).send();
});

//CHANGE LIKES (POST) ------------------------------------------------
app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params;

	const itemIndex = repositories.findIndex((repo) => repo.id === id);
	if (itemIndex < 0) {
		return response.status(400).json({ error: 'Repository not found.' });
	}

	const { title, url, techs, likes } = repositories[itemIndex];
	const newLikeNumb = likes + 1;
	const newItem = { id, title, url, techs, likes: newLikeNumb };

	repositories[itemIndex] = newItem;

	return response.json(newItem);
});

//EXPORT -------------------------------------------------------------
module.exports = app;
