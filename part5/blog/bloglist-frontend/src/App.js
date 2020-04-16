import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import ErrorNotification from './components/ErrorNotification';
import SuccessNotification from './components/SuccessNotification';


const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [newTitle, setNewTitle] = useState("");
	const [newAuthor, setNewAuthor] = useState("");
	const [newUrl, setNewUrl] = useState("");
	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		)
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
				setErrorMessage(null)
			}, 3000);
		}
	};

	const handleLogout = (event) => {
		window.localStorage.removeItem('loggedBlogappUser')
		setUser(null);
	};

	const addBlog = (event) => {
		event.preventDefault();
		const blogObject = {
			title: newTitle,
			author: newAuthor,
			url: newUrl
		};
		blogService
			.create(blogObject)
			.then(returnedBlog => {
				setBlogs(blogs.concat(returnedBlog));

				setSuccessMessage(`A new blog -> ${returnedBlog.title} by ${returnedBlog.author} added`);
				setTimeout(() => {
					setSuccessMessage(null)
				}, 3000);

				setNewTitle('');
				setNewAuthor('');
				setNewUrl('');
			});
	};

	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				Username
				<input
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				Password
				<input
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	);

	const blogForm = () => (
		<form onSubmit={addBlog}>
			<div>
				Title
				<input
					type="text"
					value={newTitle}
					name="Title"
					onChange={({ target }) => setNewTitle(target.value)}
				/>
			</div>
			<div>
				Author
				<input
					type="text"
					value={newAuthor}
					name="Author"
					onChange={({ target }) => setNewAuthor(target.value)}
				/>
			</div>
			<div>
				URL
				<input
					type="text"
					value={newUrl}
					name="Url"
					onChange={({ target }) => setNewUrl(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
			

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
					{blogForm()}
					{blogs.map(blog =>
						<Blog key={blog.id} blog={blog} />
					)}
				</div>
			}

		</div>
	)
};

export default App;