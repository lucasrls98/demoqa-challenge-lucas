import webTables from '../../pages/WebTablesPage';

describe('Web Tables', () => {
  beforeEach(() => {
    cy.fixture('web-table-records').as('data');
    webTables.visit();
    webTables.rows().should('have.length', 3);
  });

  it('adds a record → new row shows every submitted value', function () {
    webTables.addRecord(this.data.newRecord);

    cy.get(webTables.selectors.modal).should('not.exist');
    webTables.rows().should('have.length', 4);
    webTables.shouldDisplayRecord(this.data.newRecord);
  });

  it('edits a record → row reflects the updated values', function () {
    const changes = { salary: 20000, department: 'Audit' };

    webTables.editRecord(this.data.existingEmail, changes);

    webTables
      .rowFor(this.data.existingEmail)
      .should('contain', changes.salary)
      .and('contain', changes.department);
    webTables.rows().should('have.length', 3);
  });

  it('deletes a record → row is removed from the table', function () {
    webTables.deleteRecord(this.data.existingEmail);

    webTables.rows().should('have.length', 2).and('not.contain', this.data.existingEmail);
  });

  it('searches by partial, mixed-case text → only matching rows are listed', () => {
    webTables.search('LEGAL');

    webTables.rows().should('have.length', 1).first().should('contain', 'Kierra');
  });

  it('searches for a term with no match, then clears it → table empties and then recovers', () => {
    webTables.search('no-such-person');
    webTables.rows().should('not.exist');

    webTables.clearSearch();
    webTables.rows().should('have.length', 3);
  });

  it('submits an empty add form → all fields are flagged and no row is added', () => {
    webTables.openAddForm().submitForm();

    ['firstName', 'lastName', 'email', 'age', 'salary', 'department'].forEach((name) =>
      webTables.field(name).shouldBeInvalid(),
    );
    cy.get(webTables.selectors.modal).should('be.visible');
  });

  it('enters letters into age and salary → fields are flagged', function () {
    webTables
      .openAddForm()
      .fillForm({ ...this.data.newRecord, age: 'forty', salary: 'lots' })
      .submitForm();

    webTables.field('age').shouldBeInvalid();
    webTables.field('salary').shouldBeInvalid();
    cy.get(webTables.selectors.modal).should('be.visible');
  });
});
