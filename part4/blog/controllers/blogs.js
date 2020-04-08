const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');



blogsRouter.get('/', (req, res, next) => {
    Blog.find({})
        .then(blogs => {
            res.json(blogs.map(blog => blog.toJSON()));
        })
        .catch(error => next(error));
});

blogsRouter.post('/', (req, res, next) => {
    const body = req.body;

    logger.info('req body', body);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    });
    
    logger.info('new blog', blog);

    blog
        .save()
        .then(savedBlog => {
            res.json(savedBlog.toJSON());
        })
        .catch(error => next(error));
});

module.exports = blogsRouter;