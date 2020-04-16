const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');


beforeEach(async () => {
	await User.deleteMany({});
	const passwordHash = await bcrypt.hash('password', 10);
	const user = new User({ username: 'root', passwordHash });
	await user.save();

	await Blog.deleteMany();
	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});
describe('when there are initially some notes saved', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('verify unique identifier named id', async () => {
		let blogsAtStart = await helper.blogsInDb();
		const blogToView = blogsAtStart[0];
		expect(blogToView.id).toBeDefined();
	});
});

describe('addition of a new note', () => {
	test('a valid blog can be added', async () => {
		const user = {
			username: "root",
			password: "password"
		};

		const login = await api
			.post('/api/login')
			.send(user).expect(200);

		const newBlog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 33
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map(b => b.title);
		expect(titles).toContainEqual(
			'Test Title'
		);
		
	});
	
	test('default like value is 0', async () => {
		const user = {
			username: "root",
			password: "password"
		};

		const login = await api
			.post('/api/login')
			.send(user).expect(200);

		const newBlog = {
			title: 'Test Likes',
			author: 'Test Likes',
			url: 'testurl.com'
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		blogsAtEnd.forEach(blog => {
			if (blog.title === 'Test Likes')
				expect(blog.likes).toBe(0);
		});
	});

	test('title and url missing 400 response', async () => {
		const user = {
			username: "root",
			password: "password"
		};

		const login = await api
			.post('/api/login')
			.send(user).expect(200);

		const newBlog = {
			likes: 44
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(400);
	});

	test('adding blog fails without token', async () => {
		const newBlog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 33
		};
		
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);
	});
});

describe('deletion of a note', () => {
	test('succeeds with status code 204 if id is valid', async () => {

		const user = {
			username: "root",
			password: "password"
		};

		const login = await api
			.post('/api/login')
			.send(user).expect(200);

		const newBlog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 33
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsInMiddle = await helper.blogsInDb();
		expect(blogsInMiddle).toHaveLength(helper.initialBlogs.length + 1);

		const blogToDelete = blogsInMiddle[blogsInMiddle.length - 1];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const titles = blogsAtEnd.map(b => b.title);
		expect(titles).not.toContain(blogToDelete.title);
	});
});

describe('update of a note', () => {
	test('succeeds with 200 on successful update', async () => {
		const blogsAtStart = await helper.blogsInDb();
		let blogToUpdate = blogsAtStart[0];

		blogToUpdate.likes = 9999;
		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		expect(blogsAtEnd[0].likes).toBe(9999);
	});
});

afterAll(() => {
	mongoose.connection.close();
});