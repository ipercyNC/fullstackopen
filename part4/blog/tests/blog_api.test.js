const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');


beforeEach(async () => {
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
		const newBlog = {
			title: 'Test Title',
			author: 'Test Author',
			likes: 33
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
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
		const newBlog = {
			title: 'Test Likes'
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
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
		const newBlog = {
			likes: 44
		};
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);
	});
});

describe('deletion of a note', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

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