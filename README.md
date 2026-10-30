# StudyMart Playwright (interview study)

Small clone of the `tc-qa-automation` layering, simplified for **JavaScript, TypeScript, and Playwright**.

Amazon.com is used for one **optional live UI demo**. API and DB tests run against a local store (`StudyMart`) because Amazon does not give a public shop API or a database you can query.

## How this maps to the real project

| Real repo | This study folder |
| --- | --- |
| `src/tests` | specs: intent + `expect` only |
| `src/business` | workflows (no assertions) |
| `src/adapters/ui \| api \| database` | page objects, HTTP client, JSON file DB |
| `src/testdata` | JSON datasets + builders |
| `src/config/fixtures.ts` | inject workflows into tests |
| `src/constants/enums.ts` | no magic strings |

## Run

```bash
cd C:\Users\ORestrepo\Documents\qa-interview-study\study-amazon-playwright
npm install
npx playwright install chromium
npm test
```

| Command | What it runs |
| --- | --- |
| `npm test` | UI (local), API, DB, e2e — skips Amazon.com |
| `npm run test:amazon` | live amazon.com search (`@live`) |
| `npm run test:api` | REST only |
| `npm run test:db` | JSON "database" only |
| `npm run allure:generate` | HTML report from the latest `allure-results` |
| `npm run allure:open` | Open the generated Allure report |
| `npm run allure:report` | Run `npm test`, then open the Allure report |

Playwright starts `app/server.js` automatically. Every test run clears the previous `allure-results` folder, writes the new results, and rebuilds `allure-report`. Open that report with `npm run allure:open`. The Playwright HTML report is unchanged (`npm run report`).

## What to read first

1. `NOTES.md` — JS, TS, Playwright, layers, interview answers
2. `src/tests/e2e/search-api-db.spec.ts` — one flow across UI + API + DB
3. `examples/javascript-vs-typescript.js` vs `.ts`

## Live Amazon notes

Locators verified on amazon.com (Sep 2026):

- Search box: `getByRole('searchbox', { name: 'Search Amazon' })`
- Submit: Enter on the search box (Go is an `<input>` and is flaky)

Captchas, geo popups, and layout changes can fail `@live`. That is expected. Use StudyMart for a stable demo.
