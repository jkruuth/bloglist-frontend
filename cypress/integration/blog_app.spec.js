describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Joonas Ruuth',
      username: 'jkruuth',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jkruuth')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Joonas Ruuth logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jkruuth')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in',function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('jkruuth')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('create new blog').click({ force: true })
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Testaaja Timo')
      cy.get('#url').type('http://www.testing.com')
      cy.get('.create').click()

      cy.contains('a blog created by cypress by Testaaja Timo')
    })

    describe('and when blog exist', function() {
      it('it can be liked', function () {
        cy.contains('create new blog').click({ force: true })
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('Testaaja Timo')
        cy.get('#url').type('http://www.testing.com')
        cy.get('.create').click()

        cy.contains('view').click()

        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('it can be removed by authorized user', function() {
        cy.contains('create new blog').click({ force: true })
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('Testaaja Timo')
        cy.get('#url').type('http://www.testing.com')
        cy.get('.create').click()

        cy.contains('view').click()

        cy.contains('remove').click()
        cy.get('html', { timeout: 9000 }).should('not.contain', 'a blog created by cypress')
      })
    })

    describe('more than one blog', function() {
      beforeEach(function() {
        cy.contains('create new blog').click({ force: true })
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('Testaaja Timo')
        cy.get('#url').type('http://www.testing.com')
        cy.get('.create').click()

        cy.contains('create new blog').click({ force: true })
        cy.get('#title').type('this should be first')
        cy.get('#author').type('Testaaja Tiina')
        cy.get('#url').type('http://www.testing1.com')
        cy.get('.create').click()
      })

      it('then blogs are sorted by likes', function() {
        cy.contains('a blog created by cypress Testaaja Timo').contains('view').click()
        cy.contains('like').click()

        cy.get('.blogs', { timeout: 5000 }).then(blogs => {
          cy.expect(blogs[0]).to.equal('this should be first')
        })
      })
    })
  })
})