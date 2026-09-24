import BasePage from './BasePage';

const selectors = {
  addButton: '#addNewRecordButton',
  searchBox: '#searchBox',
  rows: 'tbody tr',
  editButton: '[id^="edit-record-"]',
  deleteButton: '[id^="delete-record-"]',
  form: '#userForm',
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  age: '#age',
  salary: '#salary',
  department: '#department',
  submit: '#submit',
  modal: '.modal-content',
};

const COLUMNS = ['firstName', 'lastName', 'age', 'email', 'salary', 'department'];

class WebTablesPage extends BasePage {
  constructor() {
    super('/webtables');
    this.selectors = selectors;
  }

  field(name) {
    return cy.get(selectors[name]);
  }

  rows() {
    return cy.get(selectors.rows);
  }

  rowFor(text) {
    return cy.contains(selectors.rows, text);
  }

  openAddForm() {
    cy.get(selectors.addButton).click();
    cy.get(selectors.modal).should('be.visible');
    return this;
  }

  fillForm(record) {
    Object.entries(record).forEach(([name, value]) => {
      this.field(name).clear();
      this.field(name).type(String(value));
    });
    return this;
  }

  submitForm() {
    cy.get(selectors.submit).click();
    return this;
  }

  addRecord(record) {
    return this.openAddForm().fillForm(record).submitForm();
  }

  editRecord(identifier, changes) {
    this.rowFor(identifier).find(selectors.editButton).click();
    return this.fillForm(changes).submitForm();
  }

  deleteRecord(identifier) {
    this.rowFor(identifier).find(selectors.deleteButton).click();
    return this;
  }

  search(term) {
    cy.get(selectors.searchBox).clear();
    cy.get(selectors.searchBox).type(term);
    return this;
  }

  clearSearch() {
    cy.get(selectors.searchBox).clear();
    return this;
  }

  shouldDisplayRecord(record) {
    this.rowFor(record.email)
      .find('td')
      .then(($cells) => COLUMNS.map((_, index) => $cells.eq(index).text()))
      .should(
        'deep.equal',
        COLUMNS.map((column) => String(record[column])),
      );
    return this;
  }
}

export default new WebTablesPage();
