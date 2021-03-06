import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';
import Notification from './components/Notification';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import noteService from './services/notes';
import loginService from './services/login';


const Footer = () => {
	const footerStyle = {
		color: 'green',
		fontStyle: 'italic',
		fontSize: 16
	};
	return (
		<div style={footerStyle}>
			<br />
			<em>Note app, Department of Computer Science, University of Helsinki 2020</em>
		</div>
	);
};

const App = (props) => {
	const [notes, setNotes] = useState([]);
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		noteService
			.getAll()
			.then(initialNotes => {
				setNotes(initialNotes);
			});
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			noteService.setToken(user.token);
		}
	}, []);

	const toggleImportanceOf = id => {
		const url = `http://localhost:3001/notes/${id}`;
		const note = notes.find(n => n.id === id);
		const changedNote = { ...note, important: !note.important };

		noteService
			.update(id, changedNote)
			.then(returnedNote => {
				setNotes(notes.map(note => note.id !== id ? note : returnedNote));
			})
			.catch(error => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server`
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
				setNotes(notes.filter(n => n.id !== id));
			});
	};

	const rows = () =>
		notesToShow.map(note =>
			<Note
				key={note.id}
				note={note}
				toggleImportance={() => toggleImportanceOf(note.id)}
			/>
		);
	const notesToShow = showAll ?
		notes :
		notes.filter(note => note.important);

	const addNote = (noteObject) => {
		noteFormRef.current.toggleVisibility();
		noteService
			.create(noteObject)
			.then(returnedNote => {
				setNotes(notes.concat(returnedNote));
			});
	};


	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({
				username, password,
			});

			window.localStorage.setItem(
				'loggedNoteappUser', JSON.stringify(user)
			);

			noteService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setErrorMessage('Wrong Credentials');
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
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

	const noteFormRef = React.createRef();

	const noteForm = () => (
		<Togglable buttonLabel="New Note" ref={noteFormRef}>
			<NoteForm
				createNote={addNote}
			/>
		</Togglable>
	);

	return (
		<div>
			<h1>Notes</h1>

			<Notification message={errorMessage} />

			{user === null ?
				loginForm() :
				<div>
					<p>{user.name} logged in</p>
					{noteForm()}
				</div>
			}


			<div>
				<button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
				</button>
			</div>
			<ul>
				{rows()}
			</ul>


			<Footer />
		</div>
	);
};
export default App;