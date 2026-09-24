import BasePage from './BasePage';

const selectors = {
  open: { small: '#showSmallModal', large: '#showLargeModal' },
  close: { small: '#closeSmallModal', large: '#closeLargeModal' },
  title: { small: '#example-modal-sizes-title-sm', large: '#example-modal-sizes-title-lg' },
  dialog: '[role="dialog"]',
  body: '.modal-body',
};

class ModalDialogsPage extends BasePage {
  constructor() {
    super('/modal-dialogs');
    this.selectors = selectors;
  }

  open(size) {
    cy.get(selectors.open[size]).click();
    return this;
  }

  close(size) {
    cy.get(selectors.close[size]).click();
    return this;
  }

  dialog() {
    return cy.get(selectors.dialog);
  }

  title(size) {
    return cy.get(selectors.title[size]);
  }

  body() {
    return cy.get(selectors.body);
  }
}

export default new ModalDialogsPage();
