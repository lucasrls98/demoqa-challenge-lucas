export default class BasePage {
  constructor(path) {
    this.path = path;
  }

  visit() {
    cy.visit(this.path);
    cy.get('h1').should('be.visible');
    return this;
  }

  heading() {
    return cy.get('h1');
  }
}
