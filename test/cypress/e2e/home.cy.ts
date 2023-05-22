describe('template spec', () => {
  it('try access home and redirect to server configuration', () => {
    cy.visit('/');
    cy.url()
      .should('be.equals', `${Cypress.config().baseUrl}#/server/configure`)
  })
})