# Test Summary Report

**Target:** https://demoqa.com · **Stack:** Cypress 16.1.0, JavaScript, Chrome 153 headless · **Date:** 2026-09-24

## Results

| Spec                              |  Tests | Passed | Failed | Pending |
| --------------------------------- | -----: | -----: | -----: | ------: |
| forms/practice-form.cy.js         |     11 |     10 |      0 |   1 [1] |
| elements/web-tables.cy.js         |      7 |      7 |      0 |       0 |
| elements/radio-button.cy.js       |      4 |      4 |      0 |       0 |
| widgets/select-menu.cy.js         |      5 |      5 |      0 |       0 |
| dialogs/alerts.cy.js              |      6 |      6 |      0 |       0 |
| dialogs/modal-dialogs.cy.js       |      2 |      2 |      0 |       0 |
| accessibility/accessibility.cy.js |      7 |      7 |      0 |       0 |
| **Total**                         | **42** | **41** |  **0** |   **1** |

Wall time is about 53 s. [1] The pending test reproduces [DEF-001](DEFECTS.md#def-001--practice-form-confirmation-modal-cannot-be-closed-with-close) and stays skipped until the fix ships. Artifacts are in [`docs/results/`](docs/results): an HTML report, the terminal summary, and a screenshot.

## Approach

I picked scenarios by risk, not by page count. The four scenario types:

- **Forms:** Practice Form end to end, required-only submission, empty-form validation, data-driven invalid inputs, and the State → City dependency.
- **Tables:** Web Tables CRUD, search, and form validation.
- **Selections:** native and react-select dropdowns, plus radio buttons including the disabled option.
- **Dialogs:** alert, delayed alert, confirm, prompt, and modals.

Each flow has a happy path and at least one edge case. Tests assert outcomes (rendered values, validity state, dialog messages), not just that elements are present.

## Key design decisions

- **Page Object Model with centralized selectors.** Each page exposes a `selectors` map and intent-level methods (`fill`, `addRecord`, `editRecord`). Specs never contain raw CSS.
- **Reuse by layer:** custom commands for cross-page widgets (`selectReactOption`, `shouldBeInvalid`, `checkAccessibility`), fixtures for test data, and small utilities (`formatSubmittedDate`).
- **Data-driven cases** (invalid inputs, confirm OK/Cancel, modal sizes, a11y pages) come from fixtures, so adding a case never needs new code.
- **Native validity assertions** (`:invalid`) instead of checking CSS classes. They test the browser contract, not the styling.
- **Accessibility baseline:** axe runs on every page. Known violations are logged and tracked in DEF-003, and any _new_ serious or critical violation fails the build.
- **Tags** (`@smoke`, `@a11y`) via `@cypress/grep` make fast PR checks possible.

## Flakiness and how I handled it

| Observation                                                                                                           | Handling                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Third-party ad and tracker scripts load on every page                                                                 | `blockHosts` in config. Measured suite time dropped from 1m21s to 1m02s (≈ 30%), and third-party errors are gone.                                                                                                                                 |
| `cy.type()` sets values programmatically, so `minlength` is **not** enforced. A 5-digit mobile got submitted.         | I confirmed it was a tooling artifact, not an app bug: typing through CDP (`cypress-real-events`) is blocked correctly. Invalid-input tests type natively.                                                                                        |
| Delayed alert fires after 5 s                                                                                         | `cy.clock()` / `cy.tick()` checks it does **not** fire at 4 999 ms and does at 5 000 ms. The test is deterministic and takes about 1 s.                                                                                                           |
| CI only: modal a11y scan failed `color-contrast` on `#closeSmallModal` (3.52:1) on all 3 attempts, but passed locally | Retries could not help because the failure was deterministic. axe was reading the button mid-transition on the slower runner. The a11y command now disables CSS transitions and animations and waits for zero running animations before scanning. |
| Uncaught app error on the Close button (DEF-001)                                                                      | Uncaught exceptions are **not** suppressed globally. The defect is isolated in one skipped, ID-tagged test so real errors still fail fast.                                                                                                        |
| Waiting                                                                                                               | There is no `cy.wait(ms)` anywhere, and ESLint enforces it (`cypress/no-unnecessary-waiting`). Only retry-able assertions are used.                                                                                                               |

**Stability evidence:** 3 consecutive full runs with retries disabled produced 0 failures. CI keeps `retries.runMode: 2` as a safety net for this public, shared environment.

## Known limitations

- DemoQA is a public site that changes without notice. During this work it was running a new Vite/React 19 build (`#root` instead of `#app`), which broke older public examples.
- There is no API to seed state, so all setup goes through the UI. Web Tables state resets on reload, which keeps tests independent.
- react-select inputs expose only generated IDs (`react-select-3-input`). They are centralized in page objects but would be the first thing to break. Stable `data-testid` hooks would fix that.
- `cypress-real-events` uses CDP, so the suite targets Chromium browsers. Electron is deprecated in Cypress 16, so Chrome is the default.
- Automated a11y checks catch only a subset of WCAG issues. They complement manual screen-reader testing, not replace it.

## Notable insights

- The most valuable finding was a **false positive I didn't report**: the "5-digit mobile accepted" bug existed only under synthetic typing. It shows that validation tests should use real input events.
- DEF-001 is a React 19 migration regression (`findDOMNode` removed). Adding a check for uncaught errors on key flows would catch this class of bug cheaply.

Recommendations for scaling this suite are in [RECOMMENDATIONS.md](RECOMMENDATIONS.md).
