const DEFAULT_IMPACTS = ['serious', 'critical'];

const FREEZE_MOTION_CSS =
  '*, *::before, *::after { transition: none !important; animation: none !important; }';

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
    cy.document({ log: false }).then((doc) => {
      const style = doc.createElement('style');
      style.textContent = FREEZE_MOTION_CSS;
      doc.head.appendChild(style);
    });
    cy.document({ log: false }).should((doc) => {
      expect(doc.getAnimations(), 'running animations').to.be.empty;
    });
    cy.window({ log: false })
      .then((win) => win.axe.run(win.document.querySelector(context)))
      .then(({ violations }) => {
        const relevant = violations.filter((violation) => impacts.includes(violation.impact));
        const unexpected = relevant.filter((violation) => !knownViolations.includes(violation.id));

        if (relevant.length) cy.task('table', summarize(relevant), { log: false });
        relevant.forEach(({ id, impact, nodes }) =>
          cy.log(`**a11y** ${impact}: ${id} (${nodes.length} nodes)`),
        );

        const details = unexpected.flatMap(({ id, nodes }) =>
          nodes.map(({ target, failureSummary }) => ({
            rule: id,
            target: target.join(' '),
            failure: failureSummary,
          })),
        );
        if (details.length) cy.task('table', details, { log: false });

        cy.then(() => {
          const message = details.map(({ rule, target }) => `${rule} → ${target}`).join('; ');
          expect(unexpected, `unexpected accessibility violations: ${message}`).to.be.empty;
        });
      });
  },
);
