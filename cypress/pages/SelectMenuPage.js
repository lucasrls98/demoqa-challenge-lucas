import BasePage from './BasePage';

const selectors = {
  groupedSelect: '#withOptGroup',
  groupedInput: '#react-select-2-input',
  titleSelect: '#selectOne',
  titleInput: '#react-select-3-input',
  colorMultiSelect: '#react-select-4-input',
  multiValue: '[class*="multiValue"]',
  removeValue: (label) => `[role="button"][aria-label="Remove ${label}"]`,
  oldStyleSelect: '#oldSelectMenu',
  carsSelect: '#cars',
};

class SelectMenuPage extends BasePage {
  constructor() {
    super('/select-menu');
    this.selectors = selectors;
  }

  field(name) {
    return cy.get(selectors[name]);
  }

  chooseReactOption(inputName, optionText) {
    cy.selectReactOption(selectors[inputName], optionText);
    return this;
  }

  chosenColors() {
    return this.field('colorMultiSelect')
      .closest('[class$="-container"]')
      .find(selectors.multiValue);
  }

  removeColor(color) {
    cy.get(selectors.removeValue(color)).click();
    return this;
  }
}

export default new SelectMenuPage();
