const bcrypt = require('bcrypt');
const User = require('../models/user');
const supertest = require('supertest');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash('password', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('creation succeeds with new username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'test',
			name: 'test',
			password: 'password'
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'root',
			password: 'password'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('`username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test('creation fails if username missing', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			name: 'missing username',
			password: 'password'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);
		expect(result.body.error).toContain('Please give username with at least 3 characters');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
		
	});
	test('creation fails if password missing', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'missing password',
			name: 'missing password'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);
		expect(result.body.error).toContain('Please give password with at least 3 characters');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
	afterAll(() => {
		mongoose.connection.close();
	});
})