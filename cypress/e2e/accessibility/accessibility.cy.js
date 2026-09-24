import modalDialogs from '../../pages/ModalDialogsPage';
import { sharedLayoutViolations, pages } from '../../fixtures/a11y-pages.json';

describe('Accessibility', { tags: '@a11y' }, () => {
  pages.forEach(({ name, path, knownViolations }) => {
    it(`scans ${name} → no serious or critical violations beyond the tracked baseline`, () => {
      cy.visit(path);
      cy.get('h1').should('be.visible');
      cy.injectAxe();

      cy.checkAccessibility('#root', {
        knownViolations: [...sharedLayoutViolations, ...knownViolations],
      });
    });
  });

  it('opens a modal dialog → dialog content has no serious or critical violations', () => {
    modalDialogs.visit().open('small');
    modalDialogs.dialog().should('be.visible');
    cy.injectAxe();

    cy.checkAccessibility(modalDialogs.selectors.dialog);
  });
});
