# Learning guide — ApplyTrack

A private-in-your-browser application board for tracking a student job search.

## Important files

- [`src/App.jsx`](../src/App.jsx): Application state, filters, stages, and sample records.
- [`src/components/ApplicationForm.jsx`](../src/components/ApplicationForm.jsx): Controlled inputs and URL/date validation.
- [`src/components/ApplicationCard.jsx`](../src/components/ApplicationCard.jsx): Application summary and stage/action controls.
- [`src/lib/applications.js`](../src/lib/applications.js): Allowed stages, safe URL parsing, and saved-record validation.
- [`src/hooks/useSavedState.js`](../src/hooks/useSavedState.js): Local persistence and storage error handling.
- [`tests/app.spec.js`](../tests/app.spec.js): Lifecycle, unsafe links, filters, persistence, and mobile checks.

## Five things to study

1. Model one application as an object with a stable ID.
2. Trace a stage change from a select through immutable React state.
3. Distinguish stored state from the filtered/grouped view derived from it.
4. Explain why URL parsing and protocol allowlists matter for links.
5. Compare date-only strings consistently for follow-up reminders.

## One feature to build independently

Add a small interview-preparation checklist to each application.

## Rebuild to understand

Start in an empty branch or separate practice folder. Rebuild the main form and one data update without copying, then add persistence or the API request. Explain the data flow aloud and recreate one behavior test. Compare your work with the original only after it works.

## Honest presentation

This is an AI-assisted learning project. Describe the code you can explain and the features you rebuilt yourself. Do not present it as employment, client work, or proof of independent mastery before studying it.
