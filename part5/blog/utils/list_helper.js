var _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes;
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
    let maxLikes = Number.MIN_SAFE_INTEGER, index = -1;
    blogs.forEach((blog, i) => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            index = i;
        }
    });
    return index >= 0 ?
        { 'title': blogs[index]['title'], 'author': blogs[index]['author'], 'likes': blogs[index]['likes'] }
        : { };
}

const mostBlogs = (blogs) => {
    let maxBlogs = Number.MIN_SAFE_INTEGER, maxAuthor = '';

    _.forEach(
        _.map(blogs, function (blog) {
            return {
                'author': blog.author,
                'blogs': _.filter(blogs, function (entry) { return blog.author === entry.author }).length
            };
        }), (blog) => {
            if (blog.blogs > maxBlogs) {
                maxBlogs = blog.blogs;
                maxAuthor = blog.author;
            }
        });

    return maxAuthor !== '' ?
        { 'author': maxAuthor, 'blogs': maxBlogs }
        : {};
}

const mostLikes = (blogs) => {
    let mostLikes = Number.MIN_SAFE_INTEGER, mostLikesAuthor = '', counts = {};
    _.forEach(blogs, function (blog) {
        if (counts[blog.author])
            counts[blog.author] += blog.likes;
        else
            counts[blog.author] = blog.likes;
    });
    for (let [key, value] of Object.entries(counts)) {
        if (value > mostLikes) {
            mostLikesAuthor = key;
            mostLikes = value;
        }
    }

    console.log(counts);
    return mostLikesAuthor !== ''
        ? {
            'author': mostLikesAuthor,
            'likes' : mostLikes
        }
        : {};
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}