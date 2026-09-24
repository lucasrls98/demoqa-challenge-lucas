import BasePage from './BasePage';

const selectors = {
  option: (label) => `input[name="like"] + label:contains("${label}")`,
  input: { Yes: '#yesRadio', Impressive: '#impressiveRadio', No: '#noRadio' },
  result: '.text-success',
};

class RadioButtonPage extends BasePage {
  constructor() {
    super('/radio-button');
    this.selectors = selectors;
  }

  choose(label) {
    cy.get(selectors.option(label)).click();
    return this;
  }

  input(label) {
    return cy.get(selectors.input[label]);
  }

  result() {
    return cy.get(selectors.result);
  }
}

export default new RadioButtonPage();
