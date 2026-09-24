# Recommendations

## CI/CD integration

The included workflow ([.github/workflows/e2e.yml](.github/workflows/e2e.yml)) is a starting point: lint, then the full suite on Chrome, with the HTML report uploaded on every run and screenshots uploaded on failure. As the suite grows:

| Trigger         | What runs                              | Goal                                        |
| --------------- | -------------------------------------- | ------------------------------------------- |
| Pull request    | Lint + `@smoke` (~20 s)                | Fast feedback, blocks the merge             |
| Merge to `main` | Full suite, parallelized               | Full regression before deploy               |
| Nightly (cron)  | Full suite + `@a11y`, several browsers | Catches drift in a third-party-owned target |
| Post-deploy     | `@smoke` against the deployed URL      | Release gate and rollback signal            |

- **Parallelization:** split specs across a GitHub Actions matrix with `cypress-split`, or use Cypress Cloud (`--record --parallel`) for load balancing by past spec duration and Test Replay on failures.
- **Environments:** keep `baseUrl` and environment values in config, and override them per environment with `--config baseUrl=…` or `CYPRESS_*` variables. Secrets come from CI secrets through `cy.env()` and are never committed.
- **Reporting:** publish the mochawesome report to GitHub Pages or a PR comment, and send failures to Slack with a link to the report.

## Suite organization

- Keep the current layout: `e2e/<area>/<page>.cy.js`, one page object per page, and custom commands only for cross-page widgets.
- **Tagging:** `@smoke` (critical journeys), `@regression` (default), `@a11y`, `@known-defect` (tests skipped against an open bug ID), and `@slow`. Select at run time with `--expose grepTags=…`.
- **Quarantine policy:** a flaky test gets an owner, a ticket, and a `@quarantine` tag. It runs in a separate non-blocking job until it's fixed, and it's never silently retried forever.
- Add component tests for widgets (datepicker, react-select wrappers) once the app source is available. They are faster and more precise than E2E for UI states.

## Test data and structure

- Static, readable fixtures for scenario data (as today), plus a small **factory** (e.g. `@faker-js/faker` with a seed) when uniqueness matters, such as emails in a shared backend.
- Seed and reset state through APIs or `cy.task` (database) instead of the UI once a backend exists. Use `cy.session` for authenticated flows.
- **Selector contract with developers:** add `data-testid` to interactive elements. It removes the dependency on generated IDs (`react-select-3-input`) and third-party class names.
- Keep an ESLint rule set (`eslint-plugin-cypress`) and Prettier in CI to enforce no fixed waits, no unsafe chaining, and consistent style.

## Metrics to track

| Metric                                  | Why it matters                                |
| --------------------------------------- | --------------------------------------------- |
| Pass rate per run and per spec          | Overall health; trends show regressions       |
| **Flake rate** (passed only on retry)   | Hidden instability; retries must not mask it  |
| Duration: total, p95 per spec           | Keeps PR feedback fast; flags specs to split  |
| Critical-journey coverage               | Share of `@smoke` journeys that are automated |
| Defects found by automation vs. escaped | Whether the suite catches what matters        |
| Mean time to fix a red `main`           | Team trust in the pipeline                    |
| a11y violations vs. baseline            | The baseline should only shrink               |
