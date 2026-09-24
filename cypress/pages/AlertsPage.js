import BasePage from './BasePage';

const selectors = {
  alertButton: '#alertButton',
  timerAlertButton: '#timerAlertButton',
  confirmButton: '#confirmButton',
  promptButton: '#promtButton',
  confirmResult: '#confirmResult',
  promptResult: '#promptResult',
};

class AlertsPage extends BasePage {
  constructor() {
    super('/alerts');
    this.selectors = selectors;
  }

  click(buttonName) {
    cy.get(selectors[buttonName]).click();
    return this;
  }

  confirmResult() {
    return cy.get(selectors.confirmResult);
  }

  promptResult() {
    return cy.get(selectors.promptResult);
  }
}

export default new AlertsPage();
