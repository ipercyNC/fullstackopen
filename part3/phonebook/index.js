require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
const MAX_VAL = 10000000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('client/build'));


morgan.token('body', (req) => {
	if (Object.keys(req.body).length !== 0)
		return JSON.stringify(req.body);
	else
		return '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons.map(person => person.toJSON()));
	});
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person)
				res.json(person.toJSON());
			else
				res.status(404).end();
		})
		.catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end();
		})
		.catch(error => next(error));
});

app.get('/info', (req, res) => {

	Person.find({}).then(persons => {
		let dat = new Date().toString();
		let len = persons.length;
		let str = '<div>' +
            `<div> Phonebook has info for ${len} people </div>` +
            '<br /><div>' + dat + '</div>' +
            '</div>';
		res.send(str);
	});

});


app.post('/api/persons', (req, res, next) => {
	const body = req.body;
	if (!body.name)
		return res.status(400).json({ error: 'name missing' });
	if (!body.number)
		return res.status(400).json({ error: 'number missing' });

	const personMatch = false;
	if (personMatch)
		return res.status(400).json({ error: 'name must be unique' });
	else {
		const person = new Person({
			name: body.name,
			number: body.number,
		});
		person.save().then(savedPerson => {
			res.json(savedPerson.toJSON());
		})
			.catch(error => next(error));
	}
});

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};
	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson.toJSON());
		})
		.catch(error => next(error));
});
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.log(error.message);
	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send({ error: 'malformatted id ' });
	} else if (error.name === 'ValidationError')
		return res.status(400).json({ error: error.message });
	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });