import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', () => {
	const createBlog = jest.fn();

	const component = render(
		<BlogForm createBlog={createBlog} />
	);
	const title = component.container.querySelector('#newTitle');
	const author = component.container.querySelector('#newAuthor');
	const url = component.container.querySelector('#newUrl');
	const form = component.container.querySelector('form');

	fireEvent.change(title, {
		target: { value: 'Testing Add Title' }
	});
	fireEvent.change(author, {
		target: { value: 'Testing Add Author' }
	});
	fireEvent.change(url, {
		target: { value: 'testingaddurl.com' }
	});
	fireEvent.submit(form);

	expect(createBlog.mock.calls).toHaveLength(1);

	expect(createBlog.mock.calls[0][0].title).toBe('Testing Add Title');
	expect(createBlog.mock.calls[0][0].author).toBe('Testing Add Author');
	expect(createBlog.mock.calls[0][0].url).toBe('testingaddurl.com');
});
