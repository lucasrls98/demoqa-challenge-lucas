const DEFAULT_IMPACTS = ['serious', 'critical'];

const summarize = (violations) =>
  violations.map(({ id, impact, help, nodes }) => ({
    rule: id,
    impact,
    help,
    nodes: nodes.length,
  }));

Cypress.Commands.add('injectAxe', () => {
  cy.readFile('node_modules/axe-core/axe.min.js').then((source) =>
    cy.window({ log: false }).then((win) => win.eval(source)),
  );
});

Cypress.Commands.add(
  'checkAccessibility',
  (context = 'body', { impacts = DEFAULT_IMPACTS, knownViolations = [] } = {}) => {
    cy.window({ log: false })
      .then((win) => win.axe.run(win.document.querySelector(context)))
      .then(({ violations }) => {
        const relevant = violations.filter((violation) => impacts.includes(violation.impact));
        const unexpected = relevant.filter((violation) => !knownViolations.includes(violation.id));

        if (relevant.length) cy.task('table', summarize(relevant), { log: false });
        relevant.forEach(({ id, impact, nodes }) =>
          cy.log(`**a11y** ${impact}: ${id} (${nodes.length} nodes)`),
        );

        cy.then(() => {
          expect(summarize(unexpected), 'unexpected accessibility violations').to.be.empty;
        });
      });
  },
);
