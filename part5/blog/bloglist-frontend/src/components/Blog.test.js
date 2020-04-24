import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';


describe('adjusting view', () => {
	let component;
	beforeEach(() => {
		const blog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 4
		};

		const user = {
			name: 'Test User'
		};

		component = render(
			<Blog blog={blog} user={user} />
		);
	});

	test('renders content with title and author showing', () => {
		const div = component.container.querySelector('.hideWhenFullView');

		expect(div).toHaveTextContent(
			'Test Title Test Authorview'
		);
		expect(div).not.toHaveStyle('display: none');
	});

	test('renders content with url and likes hidden at first', () => {
		const div = component.container.querySelector('.showWhenFullView');

		expect(div).toHaveStyle('display: none');
	});

	test('shows full view when "view" button clicked', () => {
		const button = component.getByText('view');
		fireEvent.click(button);

		const hideWhenFullViewDiv = component.container.querySelector('.hideWhenFullView');
		expect(hideWhenFullViewDiv).toHaveStyle('display: none');

		const showWhenFullViewDiv = component.container.querySelector('.showWhenFullView');
		expect(showWhenFullViewDiv).not.toHaveStyle('display: none');
	});
});
describe('handler function testing', () => {
	test('like button clicked twice', () => {
		const blog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 4
		};

		const user = {
			name: 'Test User'
		};

		const mockHandler = jest.fn();

		const likeComponent = render(
			<Blog blog={blog} user={user} updateBlog={mockHandler} />
		);

		const viewButton = likeComponent.getByText('view');
		fireEvent.click(viewButton);

		const hideWhenFullViewDiv = likeComponent.container.querySelector('.hideWhenFullView');
		expect(hideWhenFullViewDiv).toHaveStyle('display: none');

		const showWhenFullViewDiv = likeComponent.container.querySelector('.showWhenFullView');
		expect(showWhenFullViewDiv).not.toHaveStyle('display: none');

		const likeButton = likeComponent.getByText('like');
		fireEvent.click(likeButton);
		fireEvent.click(likeButton);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});

	test('remove button clicked', () => {
		const blog = {
			title: 'Test Title',
			author: 'Test Author',
			url: 'testurl.com',
			likes: 4
		};

		const user = {
			name: 'Test User'
		};

		const mockHandler = jest.fn();

		const removeComponent = render(
			<Blog blog={blog} user={user} deleteBlog={mockHandler} />
		);

		const viewButton = removeComponent.getByText('view');
		fireEvent.click(viewButton);

		const hideWhenFullViewDiv = removeComponent.container.querySelector('.hideWhenFullView');
		expect(hideWhenFullViewDiv).toHaveStyle('display: none');

		const showWhenFullViewDiv = removeComponent.container.querySelector('.showWhenFullView');
		expect(showWhenFullViewDiv).not.toHaveStyle('display: none');

		const removeButton = removeComponent.getByText('Remove');
		fireEvent.click(removeButton);

		expect(mockHandler.mock.calls).toHaveLength(1);
	});
});