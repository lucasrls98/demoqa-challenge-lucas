import modalDialogs from '../../pages/ModalDialogsPage';
import modals from '../../fixtures/modals.json';

describe('Modal dialogs', () => {
  beforeEach(() => {
    modalDialogs.visit();
  });

  modals.forEach(({ size, title, body }) => {
    it(
      `opens and closes the ${size} modal → content is shown, then dismissed`,
      { tags: '@smoke' },
      () => {
        modalDialogs.open(size);

        modalDialogs.dialog().should('be.visible').and('have.attr', 'aria-modal', 'true');
        modalDialogs.title(size).should('have.text', title);
        modalDialogs.body().should('contain', body);

        modalDialogs.close(size);

        modalDialogs.dialog().should('not.exist');
      },
    );
  });
});
