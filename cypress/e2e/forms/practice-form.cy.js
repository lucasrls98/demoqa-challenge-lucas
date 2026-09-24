import practiceForm from '../../pages/PracticeFormPage';
import { formatSubmittedDate } from '../../support/utils/date';
import invalidFields from '../../fixtures/invalid-student-fields.json';

describe('Practice Form', () => {
  beforeEach(() => {
    cy.fixture('students').as('students');
    practiceForm.visit();
  });

  it('submits every field → confirmation lists all submitted data', function () {
    const student = this.students.complete;

    practiceForm.fill(student).submit();

    practiceForm.confirmationModal().should('be.visible');
    cy.get(practiceForm.selectors.modalTitle).should('have.text', 'Thanks for submitting the form');
    practiceForm
      .submittedValue('Student Name')
      .should('have.text', `${student.firstName} ${student.lastName}`);
    practiceForm.submittedValue('Student Email').should('have.text', student.email);
    practiceForm.submittedValue('Gender').should('have.text', student.gender);
    practiceForm.submittedValue('Mobile').should('have.text', student.mobile);
    practiceForm
      .submittedValue('Date of Birth')
      .should('have.text', formatSubmittedDate(student.dateOfBirth));
    practiceForm.submittedValue('Subjects').should('have.text', student.subjects.join(', '));
    practiceForm.submittedValue('Hobbies').should('have.text', student.hobbies.join(', '));
    practiceForm.submittedValue('Picture').should('have.text', 'avatar.png');
    practiceForm.submittedValue('Address').should('have.text', student.address);
    practiceForm
      .submittedValue('State and City')
      .should('have.text', `${student.state} ${student.city}`);
  });

  it('submits only required fields → confirmation shows required data and blank optionals', function () {
    const student = this.students.requiredOnly;

    practiceForm.fill(student).submit();

    practiceForm
      .submittedValue('Student Name')
      .should('have.text', `${student.firstName} ${student.lastName}`);
    practiceForm.submittedValue('Gender').should('have.text', student.gender);
    practiceForm.submittedValue('Mobile').should('have.text', student.mobile);
    ['Student Email', 'Subjects', 'Hobbies', 'Picture', 'Address', 'State and City'].forEach(
      (label) => practiceForm.submittedValue(label).should('be.empty'),
    );
  });

  it('presses Escape on the confirmation → modal is dismissed', function () {
    practiceForm.fill(this.students.requiredOnly).submit();
    practiceForm.confirmationModal().should('be.visible');

    practiceForm.dismissConfirmationWithEscape();

    practiceForm.confirmationModal().should('not.exist');
  });

  it.skip('[DEF-001] clicks Close on the confirmation → modal is dismissed', function () {
    practiceForm.fill(this.students.requiredOnly).submit();
    practiceForm.confirmationModal().should('be.visible');

    practiceForm.closeConfirmation();

    practiceForm.confirmationModal().should('not.exist');
  });

  it('submits an empty form → required fields are flagged and nothing is submitted', () => {
    practiceForm.submit();

    ['firstName', 'lastName', 'mobile'].forEach((name) =>
      practiceForm.field(name).shouldBeInvalid(),
    );
    cy.get(practiceForm.selectors.genderRadios).each(($radio) => cy.wrap($radio).shouldBeInvalid());
    ['email', 'address'].forEach((name) => practiceForm.field(name).shouldBeValid());
    practiceForm.confirmationModal().should('not.exist');
  });

  invalidFields.forEach(({ field, value, reason }) => {
    it(`enters ${field} with ${reason} → field is flagged and form is not submitted`, function () {
      practiceForm.fill(this.students.requiredOnly).typeNatively(field, value).submit();

      practiceForm.field(field).shouldBeInvalid();
      practiceForm.confirmationModal().should('not.exist');
    });
  });

  it('types more than 10 digits into mobile → input is capped at 10 characters', () => {
    practiceForm.typeInto('mobile', '123456789012345');

    practiceForm.field('mobile').should('have.value', '1234567890');
  });

  it('chooses a state → city becomes enabled and lists only that state’s cities', () => {
    practiceForm.field('cityInput').should('be.disabled');

    cy.selectReactOption(practiceForm.selectors.stateInput, 'Rajasthan');

    practiceForm.field('cityInput').should('be.enabled').click();
    cy.get('[id^="react-select-4-option-"]')
      .should('have.length', 2)
      .then(($options) => Cypress._.map($options, 'innerText'))
      .should('deep.equal', ['Jaipur', 'Jaiselmer']);
  });
});
