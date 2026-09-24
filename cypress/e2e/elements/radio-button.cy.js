import radioButton from '../../pages/RadioButtonPage';

describe('Radio buttons', () => {
  beforeEach(() => {
    radioButton.visit();
  });

  ['Yes', 'Impressive'].forEach((label) => {
    it(`chooses "${label}" → option is checked and confirmed on the page`, () => {
      radioButton.choose(label);

      radioButton.input(label).should('be.checked');
      radioButton.result().should('have.text', label);
    });
  });

  it('switches between options → only the latest choice stays selected', () => {
    radioButton.choose('Yes').choose('Impressive');

    radioButton.input('Yes').should('not.be.checked');
    radioButton.input('Impressive').should('be.checked');
    radioButton.result().should('have.text', 'Impressive');
  });

  it('inspects the "No" option → it is disabled and cannot be selected', () => {
    radioButton.input('No').should('be.disabled').and('not.be.checked');
    radioButton.result().should('not.exist');
  });
});
