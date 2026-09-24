import BasePage from './BasePage';
import { monthName } from '../support/utils/date';

const selectors = {
  form: '#userForm',
  firstName: '#firstName',
  lastName: '#lastName',
  email: '#userEmail',
  genderRadios: 'input[name="gender"]',
  gender: (value) => `input[name="gender"][value="${value}"]`,
  mobile: '#userNumber',
  dateOfBirth: '#dateOfBirthInput',
  monthSelect: '.react-datepicker__month-select',
  yearSelect: '.react-datepicker__year-select',
  day: (day) =>
    `.react-datepicker__day--${String(day).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`,
  subjects: '#subjectsInput',
  hobbies: '#hobbiesWrapper',
  picture: '#uploadPicture',
  address: '#currentAddress',
  stateInput: '#react-select-3-input',
  cityInput: '#react-select-4-input',
  submit: '#submit',
  modal: '.modal-content',
  modalTitle: '#example-modal-sizes-title-lg',
  closeModal: '#closeLargeModal',
};

class PracticeFormPage extends BasePage {
  constructor() {
    super('/automation-practice-form');
    this.selectors = selectors;
  }

  field(name) {
    return cy.get(selectors[name]);
  }

  typeInto(name, value) {
    this.field(name).clear();
    this.field(name).type(value);
    return this;
  }

  typeNatively(name, value) {
    this.field(name).clear();
    this.field(name).realClick();
    cy.realType(value);
    return this;
  }

  selectGender(gender) {
    cy.get(selectors.gender(gender)).check();
    return this;
  }

  setDateOfBirth({ day, month, year }) {
    this.field('dateOfBirth').click();
    cy.get(selectors.monthSelect).select(monthName(month));
    cy.get(selectors.yearSelect).select(String(year));
    cy.get(selectors.day(day)).click();
    return this;
  }

  addSubjects(subjects) {
    subjects.forEach((subject) => cy.selectReactOption(selectors.subjects, subject));
    return this;
  }

  checkHobbies(hobbies) {
    hobbies.forEach((hobby) => cy.contains(`${selectors.hobbies} label`, hobby).click());
    return this;
  }

  uploadPicture(fixturePath) {
    this.field('picture').selectFile(`cypress/fixtures/${fixturePath}`);
    return this;
  }

  selectStateAndCity(state, city) {
    cy.selectReactOption(selectors.stateInput, state);
    cy.selectReactOption(selectors.cityInput, city);
    return this;
  }

  fill(student) {
    this.typeInto('firstName', student.firstName);
    this.typeInto('lastName', student.lastName);
    if (student.email) this.typeInto('email', student.email);
    this.selectGender(student.gender);
    this.typeInto('mobile', student.mobile);
    if (student.dateOfBirth) this.setDateOfBirth(student.dateOfBirth);
    if (student.subjects) this.addSubjects(student.subjects);
    if (student.hobbies) this.checkHobbies(student.hobbies);
    if (student.picture) this.uploadPicture(student.picture);
    if (student.address) this.typeInto('address', student.address);
    if (student.state) this.selectStateAndCity(student.state, student.city);
    return this;
  }

  submit() {
    this.field('submit').click();
    return this;
  }

  confirmationModal() {
    return cy.get(selectors.modal);
  }

  submittedValue(label) {
    return cy.contains(`${selectors.modal} td`, new RegExp(`^${label}$`)).next('td');
  }

  closeConfirmation() {
    cy.get(selectors.closeModal).click();
    return this;
  }

  dismissConfirmationWithEscape() {
    cy.realPress('Escape');
    return this;
  }
}

export default new PracticeFormPage();
