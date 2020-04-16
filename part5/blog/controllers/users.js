const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
	const body = req.body;
	if (body.username === undefined || body.username.length < 3) {
		res.status(400).json({ error: "Please give username with at least 3 characters" });
	}
	else if (body.password === undefined || body.password.length < 3) {
		res.status(400).json({ error: "Please give password with at least 3 characters" });
	}
	else {
		//console.log(body);

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(body.password, saltRounds);

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash,
		});
		const savedUser = await user.save();

		res.json(savedUser);
	}
});

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs');
	res.json(users.map(u => u.toJSON()));
});

module.exports = usersRouter;