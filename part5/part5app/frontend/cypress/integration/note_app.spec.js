
describe('Note app', function () {
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

	it('user can login', function () {
		cy.contains('Login').click();
		cy.get('#username').type('test');
		cy.get('#password').type('password');
		cy.get('#login-button').click();
		cy.contains('test logged in');
	});

	it('login fails with wrong password', function () {
		cy.contains('Login').click();
		cy.get('#username').type('test');
		cy.get('#password').type('wrong');
		cy.get('#login-button').click();

		cy.get('.error').should('contain', 'Wrong Credentials')
			.and('have.css', 'color', 'rgb(255, 0, 0)')
			.and('have.css', 'border-style', 'solid');

		cy.get('html').should('not.contain', 'test logged in');
	});

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'test', password: 'password' });
		});

		it('a new note can be created', function () {
			cy.contains('New Note').click();
			cy.get('input').type('a note created by cypress');
			cy.contains('save').click();
			cy.contains('a note created by cypress');
		});

		describe('and a note exists', function () {
			beforeEach(function () {
				cy.createNote({
					content: 'another note cypress',
					important: false
				});
			});

			it('it can be made important', function () {
				cy.contains('another note cypress').parent().find('button').as('theButton');
				cy.get('@theButton').click();
				cy.get('@theButton').should('contain', 'make not important');
			});
		});

		describe('and several notes exist', function () {
			beforeEach(function () {
				cy.createNote({ content: 'first note', important: false });
				cy.createNote({ content: 'second note', important: false });
				cy.createNote({ content: 'third note', important: false });
			});

			it('one of those can be made important', function () {
				cy.contains('second note').parent().find('button').as('theButton');
				cy.get('@theButton').click();
				cy.get('@theButton').should('contain', 'make not important');
			});
		});
	});



});