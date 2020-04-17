import React, { useState } from 'react';

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
	const [fullView, setFullView] = useState(false);
	const hideWhenFullView = { display: fullView ? 'none' : '' };
	const showWhenFullView = { display: fullView ? '' : 'none' };

	const toggleFullView = () => {
		setFullView(!fullView);
	};

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	};

	return (
		<div style={blogStyle}>
			<div style={hideWhenFullView}>
				{blog.title} {blog.author}
				<button onClick={toggleFullView}>view</button>
			</div>
			<div style={showWhenFullView}>
				<div>
					{blog.title} {blog.author}
					<button onClick={toggleFullView}>hide</button>
				</div>
				<div>
					{blog.url}
					<br />
                    Likes: {blog.likes}
					<button onClick={() => updateBlog({ blog })}>like</button>
					<br />
					{user.name}
					<br />
					<button onClick={() => deleteBlog({ blog })}>Remove</button>
				</div>

			</div>
		</div>
	);
};

export default Blog;
