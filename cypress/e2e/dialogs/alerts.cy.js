import alertsPage from '../../pages/AlertsPage';

describe('Browser dialogs', () => {
  beforeEach(() => {
    alertsPage.visit();
  });

  it('clicks the alert button → alert shows the expected message', { tags: '@smoke' }, () => {
    cy.on('window:alert', cy.stub().as('alert'));

    alertsPage.click('alertButton');

    cy.get('@alert').should('have.been.calledOnceWith', 'You clicked a button');
  });

  it('clicks the delayed alert button → alert appears only after 5 seconds', () => {
    cy.clock();
    cy.on('window:alert', cy.stub().as('alert'));

    alertsPage.click('timerAlertButton');

    cy.tick(4999);
    cy.get('@alert').should('not.have.been.called');
    cy.tick(1);
    cy.get('@alert').should('have.been.calledOnceWith', 'This alert appeared after 5 seconds');
  });

  [
    { accept: true, result: 'Ok' },
    { accept: false, result: 'Cancel' },
  ].forEach(({ accept, result }) => {
    it(`answers the confirm box with ${result} → page reports the choice`, () => {
      cy.on('window:confirm', cy.stub().as('confirm').returns(accept));

      alertsPage.click('confirmButton');

      cy.get('@confirm').should('have.been.calledOnceWith', 'Do you confirm action?');
      alertsPage.confirmResult().should('have.text', `You selected ${result}`);
    });
  });

  it('enters a name in the prompt → page greets the entered name', () => {
    const name = 'Katherine Johnson';
    cy.window().then((win) => cy.stub(win, 'prompt').as('prompt').returns(name));

    alertsPage.click('promptButton');

    cy.get('@prompt').should('have.been.calledOnceWith', 'Please enter your name');
    alertsPage.promptResult().should('have.text', `You entered ${name}`);
  });

  it('dismisses the prompt → no result is shown', () => {
    cy.window().then((win) => cy.stub(win, 'prompt').as('prompt').returns(null));

    alertsPage.click('promptButton');

    cy.get('@prompt').should('have.been.calledOnce');
    alertsPage.promptResult().should('not.exist');
  });
});
