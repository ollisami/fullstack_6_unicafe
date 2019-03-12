describe('Blog ', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      const user = {
        name: 'test',
        username: 'test',
        password: 'test'
      }
      cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
      })

    it('front page can be opened', function() {
      cy.contains('blogs')
    })

    it('login form can be opened', function() {
        cy.contains('login')
          .click()
    })

    it('user can login', function() {
        cy.get('input:first')
          .type('t')
        cy.get('input:last')
          .type('test')
        cy.contains('kirjaudu')
          .click()
        cy.contains('test logged in')
      })
  })