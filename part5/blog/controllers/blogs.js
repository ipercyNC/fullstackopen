const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');



blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    res.json(blogs.map(blog => blog.toJSON()));
});



blogsRouter.post('/', async (req, res) => {
	const body = req.body;
	const decodedToken = jwt.verify(body.token, process.env.SECRET);
	if (!body.token || !decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);

	if (body.title === undefined && body.url === undefined) {
		res.status(400).end();
	} else { 
		logger.info('req body', body);

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes === undefined ? 0 : body.likes,
			user: user._id
		});

		logger.info('new blog', blog);
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		res.json(savedBlog.toJSON());
	}
});

blogsRouter.delete('/:id', async (req, res) => {
	const body = req.body;
	const decodedToken = jwt.verify(body.token, process.env.SECRET);
	if (!body.token || !decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findById(decodedToken.id);
	const blog = await Blog.findById(req.params.id);
	if (blog.user.toString() === user._id.toString()) {
		await Blog.findByIdAndRemove(req.params.id);
		return res.status(204).end();
	} else {
		return res.status(401).json({ error: 'You do not have permission to remove this blog' });
	}	
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