# Defect Report

Environment for all findings: https://demoqa.com (build `index-D_rDx8ml.js`), Chrome 153 on Windows 11, Cypress 16.1.0, 2026-09-24.

| ID      | Title                                                                       | Severity | Priority |
| ------- | --------------------------------------------------------------------------- | -------- | -------- |
| DEF-001 | Practice Form confirmation modal cannot be closed with **Close**            | Moderate | High     |
| DEF-002 | Web Tables shows "Page 1 of 0" and no empty state when search finds nothing | Minor    | Low      |
| DEF-003 | Form controls and buttons have no accessible name                           | Major    | Medium   |

---

## DEF-001 — Practice Form confirmation modal cannot be closed with Close

**Component:** Forms › Practice Form (`/automation-practice-form`)

**Steps to reproduce**

1. Open https://demoqa.com/automation-practice-form.
2. Fill in First Name `Alan`, Last Name `Turing`, Gender `Male`, Mobile `0123456789`.
3. Click **Submit**. The "Thanks for submitting the form" modal opens.
4. Click **Close** at the bottom of the modal.

**Expected:** The modal closes and the form is shown again.

**Actual:** The modal stays open. The console logs an uncaught error:

```
Uncaught TypeError: Lr.findDOMNode is not a function
    at onClick (https://demoqa.com/assets/index-D_rDx8ml.js:36:57250)
```

Pressing **Escape** or clicking the backdrop outside the modal does close it. The Close buttons on the Modal Dialogs page (`/modal-dialogs`) work as expected.

**Severity: Moderate.** Every submission ends in this modal, and its only labelled exit fails with a JavaScript error. Workarounds exist (Escape, clicking the backdrop), but users are unlikely to find them. No data is lost.

**Priority: High.** It affects 100% of submissions on the page's main flow, and the likely fix is small. `ReactDOM.findDOMNode` was removed in React 19. The fix is to upgrade the modal/transition library or pass a `nodeRef` to the transition.

**Evidence**

- Screenshot: [docs/defects/DEF-001-modal-still-open-after-close.png](docs/defects/DEF-001-modal-still-open-after-close.png)
- Console error: [docs/defects/DEF-001-console-error.txt](docs/defects/DEF-001-console-error.txt)
- Automated: `[DEF-001] clicks Close on the confirmation → modal is dismissed` in `cypress/e2e/forms/practice-form.cy.js`. It is skipped until the fix ships. The Escape path is covered by an active test.

---

## DEF-002 — Web Tables shows "Page 1 of 0" and no empty state when search finds nothing

**Component:** Elements › Web Tables (`/webtables`)

**Steps to reproduce**

1. Open https://demoqa.com/webtables.
2. Type `no-such-person` in the search box.

**Expected:** An empty-state message is shown (for example "No rows found"), and pagination reads "Page 1 of 1" or is hidden.

**Actual:** The table body is empty with no message, and pagination reads **"Page 1 of 0"**.

**Severity: Minor.** It is a cosmetic and clarity problem. No data or functionality is affected.

**Priority: Low.** Users can still recover by clearing the search. It's worth fixing in the same pass as other table polish.

**Evidence:** [docs/defects/DEF-002-page-1-of-0.png](docs/defects/DEF-002-page-1-of-0.png)

---

## DEF-003 — Form controls and buttons have no accessible name

**Component:** Practice Form, Select Menu, Web Tables, and the shared site header

**Steps to reproduce**

1. Run `npm run test:a11y`. It runs axe-core 4.13.0 on each page with serious and critical impacts.
2. Alternatively, open the pages with a screen reader (NVDA or VoiceOver) and tab through the controls.

**Expected:** Every interactive control has a programmatic accessible name (WCAG 2.1 A: 1.1.1, 1.3.1, 4.1.2).

**Actual:**

| Page          | Rule (impact)                                      | Elements                                                                |
| ------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| Practice Form | `label` (critical), `label-title-only` (serious)   | `#dateOfBirthInput`, `#subjectsInput`, `#uploadPicture`, state combobox |
| Select Menu   | `label` (critical), `select-name` (critical)       | 3 react-select comboboxes, `#oldSelectMenu`, `#cars`                    |
| Web Tables    | `button-name` (critical), `select-name` (critical) | search icon button `#basic-addon2`, page-size `<select>`                |
| All pages     | `image-alt` (critical), `link-name` (serious)      | header logo link and image                                              |

The visible `<label>` elements on the Practice Form have no `for` attribute. Three of them also share the same `id="subjects-label"`, so they cannot be referenced reliably with `aria-labelledby`.

**Severity: Major** for assistive-technology users. The controls are announced as "edit text" or "button" with no name, which makes the form hard to complete without sight.

**Priority: Medium.** The fixes are low effort (`for`/`id` pairs, `aria-label`, `alt`) and can be batched. Automated tests baseline these rules, so any new violation fails the build.

**Evidence**

- axe output per page: [docs/defects/DEF-003-axe-violations.txt](docs/defects/DEF-003-axe-violations.txt)
- Baseline: `cypress/fixtures/a11y-pages.json`
