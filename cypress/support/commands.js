Cypress.Commands.add('selectReactOption', (inputSelector, optionText) => {
  cy.get(inputSelector).type(optionText);
  cy.contains('[id^="react-select-"][id*="-option-"]', optionText).click();
});

Cypress.Commands.add('shouldBeInvalid', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('match', ':invalid');
});

Cypress.Commands.add('shouldBeValid', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('match', ':valid');
});
