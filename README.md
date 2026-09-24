# DemoQA · Cypress E2E Suite

[![E2E](https://github.com/lucasrls98/demoqa-cypress-challenge/actions/workflows/e2e.yml/badge.svg)](https://github.com/lucasrls98/demoqa-cypress-challenge/actions/workflows/e2e.yml)

Automated end-to-end tests for [demoqa.com](https://demoqa.com), covering forms, tables, selections, dialogs, and accessibility.

**Latest run:** 42 tests · 41 passed · 0 failed · 1 pending (known defect) · ~53 s.
See [REPORT.md](REPORT.md), [DEFECTS.md](DEFECTS.md), and [RECOMMENDATIONS.md](RECOMMENDATIONS.md).

## Prerequisites

- Node.js **22+** (see `.nvmrc`)
- Google Chrome (the suite uses Chrome DevTools Protocol for native input events)

## Install

```bash
git clone https://github.com/lucasrls98/demoqa-cypress-challenge.git
cd demoqa-cypress-challenge
npm ci
```

## Run

| Command                | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `npm test`             | **Main suite**, headless Chrome                |
| `npm run test:headed`  | Main suite in a visible Chrome window          |
| `npm run test:smoke`   | Only `@smoke` tests (critical journeys, ~20 s) |
| `npm run test:a11y`    | Only `@a11y` accessibility scans               |
| `npm run cy:open`      | Interactive Cypress runner                     |
| `npm run lint`         | ESLint (incl. `eslint-plugin-cypress`)         |
| `npm run format:check` | Prettier check                                 |

Run a single spec with `npx cypress run --browser chrome --spec cypress/e2e/forms/practice-form.cy.js`.
Point at another environment with `npx cypress run --config baseUrl=https://staging.example.com`.

## View results

- **HTML report:** `cypress/reports/index.html`, generated on every run, with embedded screenshots of failures.
- **Screenshots:** `cypress/screenshots/`, captured automatically on failure.
- **Terminal:** per-spec summary table. Accessibility violations are printed as tables.
- **CI:** the report is uploaded as the `cypress-report` artifact on every GitHub Actions run.
- A committed snapshot of the latest run is in [`docs/results/`](docs/results) (`report.html`, `run-summary.txt`, `report-summary.png`).

## Project structure

```
cypress/
├── e2e/                     # Specs, grouped by site area
│   ├── accessibility/
│   ├── dialogs/
│   ├── elements/
│   ├── forms/
│   └── widgets/
├── fixtures/                # Test data (JSON) and upload files
├── pages/                   # Page objects with centralized selectors
└── support/
    ├── commands.js          # Shared custom commands
    ├── accessibility.js     # axe-core injection and baseline check
    ├── utils/               # Pure helpers
    └── e2e.js               # Support entry point
cypress.config.js            # Base URL, timeouts, retries, reporter, blocked hosts
.github/workflows/e2e.yml    # CI pipeline
docs/                        # Run artifacts and defect evidence
```

## Configuration highlights

| Setting                 | Value                         | Reason                                         |
| ----------------------- | ----------------------------- | ---------------------------------------------- |
| `baseUrl`               | `https://demoqa.com`          | Specs visit relative paths                     |
| `defaultCommandTimeout` | 10 s                          | Public site with variable latency              |
| `pageLoadTimeout`       | 60 s                          | Slow first loads                               |
| `retries`               | 2 in run mode, 0 in open mode | CI safety net that doesn't hide flakes locally |
| `blockHosts`            | Ad and tracking domains       | Removes third-party noise, ~30% faster         |
| `viewportWidth/Height`  | 1920 × 1080                   | Desktop layout without overlapping ads         |

## Conventions

- Tests are independent and runnable in isolation, and each one starts from `visit()`.
- Titles follow `action → expected result`.
- No fixed waits (`cy.wait(ms)`), enforced by ESLint.
- Tests for open defects are skipped and prefixed with their ID (e.g. `[DEF-001]`), so they can be re-enabled once the fix ships.
