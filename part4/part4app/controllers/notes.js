const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
	const notes = await Note.find({});
	res.json(notes.map(note => note.toJSON()));
});

notesRouter.get('/:id', async (req, res) => {
	const note = await Note.findById(req.params.id);
	if (note) {
		res.json(Note(note).toJSON());
	} else {
		res.status(404).end();
	}
});

notesRouter.post('/', async (req, res) => {
	const body = req.body;

	const note = new Note({
		content: body.content,
		important: body.important === undefined ? false : body.important,
		date: new Date(),
	});

	const savedNote = await note.save();
	res.json(Note(savedNote).toJSON());
});

notesRouter.delete('/:id', async (req, res) => {
	await Note.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

notesRouter.put('/:id', async (req, res) => {
	const body = req.body;

	const note = {
		content: body.content,
		important: body.important
	};

	const updatedNote = Note.findByIdAndUpdate(req.params.id, note, { new: true });
	res.json(Note(updatedNote).toJSON());
});

module.exports = notesRouter;