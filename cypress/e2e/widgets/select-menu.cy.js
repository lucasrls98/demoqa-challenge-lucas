import selectMenu from '../../pages/SelectMenuPage';

describe('Select menus', () => {
  beforeEach(() => {
    selectMenu.visit();
  });

  it('picks an option from a grouped dropdown → selection is displayed', () => {
    selectMenu.chooseReactOption('groupedInput', 'Group 2, option 1');

    selectMenu.field('groupedSelect').should('contain', 'Group 2, option 1');
  });

  it('picks a title → selection replaces the placeholder', { tags: '@smoke' }, () => {
    selectMenu.field('titleSelect').should('contain', 'Select Title');

    selectMenu.chooseReactOption('titleInput', 'Dr.');

    selectMenu.field('titleSelect').should('contain', 'Dr.').and('not.contain', 'Select Title');
  });

  it('picks from the native select → option value is applied', () => {
    selectMenu.field('oldStyleSelect').select('Purple');

    selectMenu.field('oldStyleSelect').should('have.value', '4');
    selectMenu.field('oldStyleSelect').find('option:selected').should('have.text', 'Purple');
  });

  it('picks several cars from the native multi-select → all are selected', () => {
    selectMenu.field('carsSelect').select(['Volvo', 'Audi']);

    selectMenu.field('carsSelect').invoke('val').should('deep.equal', ['volvo', 'audi']);
  });

  it('adds and removes colors in the multi-select dropdown → chips reflect the selection', () => {
    ['Green', 'Blue', 'Black'].forEach((color) =>
      selectMenu.chooseReactOption('colorMultiSelect', color),
    );
    selectMenu.chosenColors().should('have.length', 3);

    selectMenu.removeColor('Blue');

    selectMenu
      .chosenColors()
      .should('have.length', 2)
      .and('contain', 'Green')
      .and('contain', 'Black')
      .and('not.contain', 'Blue');
  });
});
