import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import ErrorNotification from './components/ErrorNotification';
import SuccessNotification from './components/SuccessNotification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';


const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [user, setUser] = useState(null);
	const [order, setOrder] = useState(null);

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		);
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({
				username, password
			});
			window.localStorage.setItem(
				'loggedBlogappUser', JSON.stringify(user)
			);
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setErrorMessage('Wrong username or password');
			setTimeout(() => {
				setErrorMessage(null);
			}, 3000);
		}
	};

	const handleLogout = (event) => {
		window.localStorage.removeItem('loggedBlogappUser');
		setUser(null);
	};
	const handleSort = (event) => {
		let sorted = blogs.slice();
		if (order === null || order === false) {
			sorted.sort((a, b) => { return b.likes - a.likes; });
			setOrder(true);
		}
		else {
			sorted.sort((a, b) => { return a.likes - b.likes; });
			setOrder(false);
		}
		setBlogs(sorted);
	};

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility();
		blogService
			.create(blogObject)
			.then(returnedBlog => {
				setBlogs(blogs.concat(returnedBlog));

				setSuccessMessage(`A new blog -> ${returnedBlog.title} by ${returnedBlog.author} added`);
				setTimeout(() => {
					setSuccessMessage(null);
				}, 3000);
			});
	};

	const updateBlog = (blogObject) => {
		blogObject.blog.likes++;
		blogService
			.update(blogObject)
			.then(returnedBlog => {
				let matchIndex = 0, update = [];
				blogs.forEach((blog, index) => {
					if (blog.id === returnedBlog.id) {
						matchIndex = index;
					}
				});
				for (let i = 0; i < blogs.length; i++) {
					if (i === matchIndex) {
						update.push(returnedBlog);
					} else {
						update.push(blogs[i]);
					}
				}
				setBlogs(update);
			});
	};
	const deleteBlog = (blogObject) => {
		if (window.confirm(`Remove blog ${blogObject.blog.title} by ${blogObject.blog.author}`)) {
			blogService
				.deleteBlog(blogObject)
				.then(returnedBlog => {
					if (returnedBlog === '') {
						let matchIndex = 0, update = [];
						blogs.forEach((blog, index) => {
							if (blog.id === blogObject.blog.id) {
								matchIndex = index;
							}
						});
						for (let i = 0; i < blogs.length; i++) {
							if (i !== matchIndex)
								update.push(blogs[i]);
						}
						setBlogs(update);
					}
				});
		}
	};

	const loginForm = () => (
		<Togglable buttonLabel="Login">
			<LoginForm
				username={username}
				password={password}
				handleUsernameChange={({ target }) => setUsername(target.value)}
				handlePasswordChange={({ target }) => setPassword(target.value)}
				handleSubmit={handleLogin}
			/>
		</Togglable>
	);

	const blogFormRef = React.createRef();

	const blogForm = () => (
		<Togglable buttonLabel="Add New Blog" ref={blogFormRef}>
			<BlogForm createBlog={addBlog} />
		</Togglable>
	);

	return (
		<div>
			<ErrorNotification message={errorMessage} />
			<SuccessNotification message={successMessage} />
			{user === null ?
				<div>
					<h2>log in to application</h2>
					{loginForm()}
				</div> :
				<div>
					<h2>blogs</h2>
					<p> {user.name} logged in<button onClick={handleLogout}>logout</button></p>
					<button onClick={handleSort}>Sort By Likes</button>
					{blogForm()}
					{blogs.map(blog =>
						<Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
					)}
				</div>
			}

		</div>
	);
};

export default App;