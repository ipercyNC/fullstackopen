const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');



blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({});
    res.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post('/', async (req, res) => {
	const body = req.body;

	if (body.title === undefined && body.url === undefined) {
		res.status(400).end();
	} else { 
		logger.info('req body', body);

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes === undefined ? 0 : body.likes,
		});

		logger.info('new blog', blog);
		const savedBlog = await blog.save();
		res.json(savedBlog.toJSON());
	}
});

blogsRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
	const body = req.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	};

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
	res.json(Blog(updatedBlog).toJSON());
});


module.exports = blogsRouter;