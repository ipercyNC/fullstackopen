describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset');
		const user = {
			name: 'test',
			username: 'test',
			password: 'password'
		};
		cy.request('POST', 'http://localhost:3001/api/users/', user);
		cy.visit('http://localhost:3000');
	});
	it('Login form is shown', function () {
		cy.contains('Login');
	});
	describe('Login', function () {
		it('user can login', function () {
			cy.contains('Login').click();
			cy.get('#username').type('test');
			cy.get('#password').type('password');
			cy.get('#login-button').click();

			cy.contains('test logged in');
		});
		it('fails with wrong credentials', function () {
			cy.contains('Login').click();
			cy.get('#username').type('test');
			cy.get('#password').type('wrong');
			cy.get('#login-button').click();

			cy.get('.error').should('contain', 'Wrong username or password');
		});
	});

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'test', password: 'password' });
			cy.createBlog({
				title: 'test blog',
				author: 'test author',
				url: 'testurl.com',
				likes: 0
			});
		});

		it('a new blog can be created', function () {
			cy.contains('test blog');
		});

		it('a blog can be liked', function () {
			cy.contains('view').click();
			cy.get('.showWhenFullView').should('contain', 'Likes: 0');
			cy.contains('like').click();
			cy.get('.showWhenFullView').should('contain', 'Likes: 1');
		});

		it('a blog can be deleted', function () {
			cy.contains('view').click();
			cy.contains('Remove').click();
			cy.get('html').should('not.contain', 'test blog');
		});
	});
	describe('When logged in with other user', function () {
		beforeEach(function () {

			cy.login({ username: 'test', password: 'password' });
			cy.createBlog({
				title: 'test blog',
				author: 'test author',
				url: 'testurl.com',
				likes: 0
			});
			cy.get('#logout-button').click();

			const user = {
				name: 'other-test',
				username: 'other-test',
				password: 'password'
			};
			cy.request('POST', 'http://localhost:3001/api/users/', user);
			cy.login({ username: 'other-test', password: 'password' });
		});

		it('a blog cant be deleted by other user', function () {
			cy.contains('view').click();
			cy.contains('Remove').click();
			cy.get('html').should('contain', 'test blog');
		});
	});

	describe('Likes ordering', function () {
		beforeEach(function () {
			cy.login({ username: 'test', password: 'password' });
			cy.createBlog({
				title: 'third most blog',
				author: 'third most author',
				url: 'thirdmosturl.com',
				likes: 0
			});
			cy.createBlog({
				title: 'second most blog',
				author: 'second most author',
				url: 'secondmosturl.com',
				likes: 5
			});
			cy.createBlog({
				title: 'first most blog',
				author: 'first most author',
				url: 'firstmosturl.com',
				likes: 10
			});
		});

		it('get all blogs', function () {
			cy.contains('third most').contains('view').click();
			cy.contains('second most').contains('view').click();
			cy.contains('first most').contains('view').click();
			cy.contains('Sort By Likes').click();
			cy.get('.blog').then(blogs => {
				let before = [];
				for (let i = 0; i < blogs.length; i++) {
					const regex = /Likes: [0-9]+/g;
					const element = blogs[i].lastElementChild.innerHTML;
					let likes = element.match(regex);
					let number = likes[0].split(':');
					before.push(parseInt(number[1]));
				}
				let sorted = before.slice();
				sorted.sort((a, b) => { return b - a; });
				console.log('before ', before);
				console.log('sorted ', sorted);
				expect(sorted).to.deep.eq([10,5,0]);
			});
		});
	});
});