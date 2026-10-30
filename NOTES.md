# Interview notes: JavaScript, TypeScript, Playwright, layered automation

Use this folder as a talking sample. The real job repo (`tc-qa-automation`) is the same idea with more domains (Vault, TC Link, Citadel).

---

## 1. Say this in 60 seconds

"I automate UI, API, and database checks with Playwright and TypeScript. Specs describe business intent and hold assertions. Workflows orchestrate steps. Adapters hide locators, HTTP, and SQL. Test data comes from JSON plus builders, not hardcoded values. Fixtures wire adapters into workflows so tests stay thin."

Point at:

- `src/tests/e2e/search-api-db.spec.ts`
- `src/business/StoreSearchWorkflow.ts`
- `src/adapters/ui/pages/StoreHomePage.ts`
- `src/testdata/builders/ProductBuilder.ts`

---

## 2. Why layers (SOLID in this project)

| Layer | Single responsibility | Depends on |
| --- | --- | --- |
| **Tests** | What should happen + `expect` | Workflows, builders |
| **Business** | How the user journey is sequenced | Adapter **interfaces** |
| **Adapters** | How we click, call HTTP, read DB | Playwright `Page` / `request` / `fs` |
| **Test data** | Isolated, named datasets | JSON + enums |
| **Config** | Compose objects (fixtures) | All of the above |

Interview lines:

- **S**: a page object does not assert; a spec does not know CSS.
- **O**: add a new workflow without rewriting every spec.
- **L**: business takes `IProductApi`, so a mock API could replace `ProductApi`.
- **I**: small interfaces (`IStoreHomePage`) instead of one giant POM.
- **D**: fixtures inject implementations; workflows do not `new` pages.

---

## 3. JavaScript you must be able to explain

### 3.1 `let` / `const` / `var`

- `const` = binding cannot be reassigned (object fields can still change).
- `let` = block scope, can reassign.
- `var` = function scope, hoisted — avoid in new code.

### 3.2 Types that still exist at runtime

```js
typeof 'a'        // 'string'
typeof 1          // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof null       // 'object'  (famous JS quirk)
typeof {}         // 'object'
typeof []         // 'object'
Array.isArray([]) // true
```

### 3.3 Truthy / falsy

Falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`.

```js
const name = input ?? 'guest';  // only null/undefined
const label = title || 'n/a';   // any falsy value
```

### 3.4 Equality

- `==` coerces types (`'1' == 1` is true) — avoid.
- `===` strict — use this.
- Playwright: `expect(value).toBe(1)` uses `Object.is` (strict).

### 3.5 Functions

```js
function search(term) { return term; }           // hoisted
const search = function (term) { return term; }; // expression
const search = (term) => term;                   // arrow, no own `this`
```

In page objects, **methods** use `this.page`, so prefer class methods, not arrows on the prototype.

### 3.6 Async

```js
async function load() {
  const res = await request.get('/api/products');
  return res.json();
}
```

- `async` functions always return a Promise.
- Always `await` Playwright calls (`click`, `fill`, `expect`).
- Do not use `forEach` + `async` (it does not wait). Use `for...of` or `Promise.all`.
- Playwright auto-waits on locators; avoid `waitForTimeout`.

### 3.7 Destructuring, spread, optional chaining

```js
const { asin, title } = product;
const copy = { ...product, stock: product.stock - 1 };
const error = body?.error ?? '';
```

### 3.8 Array methods (very common in interviews)

```js
products.map((p) => p.asin);
products.filter((p) => p.department === 'Electronics');
products.find((p) => p.asin === 'B0STUDY01');
products.some((p) => p.stock === 0);
products.reduce((sum, p) => sum + p.price, 0);
```

### 3.9 Closures

A function remembers variables from the scope where it was created. Builders close over `private` fields until `build()`.

### 3.10 `this`

- In a class method, `this` is the instance.
- Arrow functions inherit `this` from the outer scope.
- Losing `this`: `const open = page.open; open();` — bind or keep `page.open()`.

---

## 4. TypeScript you must be able to explain

TypeScript is JavaScript **plus a type checker**. Types are erased at runtime. Playwright still runs JS.

### 4.1 Why we use it in QA

- Specs and POMs autocomplete (`page.getByRole`).
- `IProduct` documents the API contract.
- Refactors (rename `asin`) fail the compile instead of failing at 2 a.m. in CI.

### 4.2 Core syntax

```ts
let price: number = 29.99;
function add(a: number, b: number): number {
  return a + b;
}
```

### 4.3 Interface vs type

```ts
interface IProduct { asin: string; price: number; }
type SearchTerm = string;
type Result = { heading: string; count: number };
```

Use **interfaces** for object shapes passed between layers. Use **type** for unions/aliases.

### 4.4 Union + narrowing

```ts
type Body = IProduct | { error: string };

function titleOf(body: Body): string {
  if ('error' in body) {
    return body.error;
  }
  return body.title;
}
```

### 4.5 Enums (this repo)

```ts
export enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
}
expect(status).toBe(HttpStatus.OK);
```

Interview: enums name magic values. Prefer enums or `as const` objects over raw `'PLACED'` strings.

### 4.6 Generics (short)

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Playwright: `Locator`, `Page`, `APIRequestContext` are generic-ish typed APIs.

### 4.7 `any` vs `unknown`

- `any` turns the checker off — avoid.
- `unknown` forces a type guard before use.

### 4.8 Demo

Run the JS example and read the TS twin:

- `examples/javascript-vs-typescript.js` — `'1.01'` concatenates → `"29.991.01"`.
- `examples/javascript-vs-typescript.ts` — that call would not compile.

---

## 5. Playwright

### 5.1 What it is

Library + test runner: browsers, auto-wait, traces, APIRequestContext, fixtures.

### 5.2 Locator order (say this)

1. `getByRole` (accessibility name)
2. `getByLabel` / `getByPlaceholder` / `getByText`
3. `getByTestId`
4. CSS / XPath last

Amazon.com (checked in browser, Sep 2026):

```ts
page.getByRole('searchbox', { name: 'Search Amazon' })
```

StudyMart:

```ts
page.getByRole('searchbox', { name: 'Search StudyMart' })
page.getByTestId('product-card')
```

### 5.3 Auto-wait

`locator.click()` waits for visible, stable, enabled. Assertions like `toBeVisible()` retry until timeout.

### 5.4 Fixtures

`test.extend` injects `page`, `request`, and our workflows. Same idea as `src/config/fixtures.ts` in the real repo.

### 5.5 `test.step`

Groups Arrange / Act / Assert in the report. Interviewers like this.

### 5.6 Isolation

Each test gets a new context (cookies). Shared files (`app/db.json`) are **not** isolated — that is why the e2e test restores stock.

### 5.7 UI vs API vs DB in Playwright

| Kind | Tool | Example here |
| --- | --- | --- |
| UI | `page` + POM | search, add to cart |
| API | `request.get/post` | `/api/products`, `/api/orders` |
| DB | driver (`pg` at work, JSON file here) | stock after order |

Strong interview story: **UI proves the customer path, API proves the contract, DB proves persistence.**

---

## 6. Walk the Amazon / StudyMart flow

1. Dataset `searches.json` → `SearchBuilder.headphones()`.
2. Spec calls `storeSearch.searchCatalog(data)` (business).
3. Workflow opens store, fills search, clicks Go.
4. Page object uses roles/test ids only.
5. Spec asserts heading contains `headphones`.
6. E2E then clicks Add to cart → POST `/api/orders` → `db.json` stock decreases.
7. Spec asserts UI status, API stock, DB stock, then restores stock.

Live Amazon (`@live`) only checks that the results URL contains the keyword. Do not scrape Amazon or automate checkout in an interview sample.

---

## 7. Likely interview questions

**POM vs this architecture?**
POM is the UI adapter. We add workflows so a spec never imports pages, and we add API/DB adapters for the same journey.

**Where do assertions go?**
Only in specs. Workflows return data.

**Flaky tests?**
Dynamic Amazon DOM, captcha, network, shared DB file, `waitForTimeout`, poor locators. Fix with roles, auto-wait, test ids, isolated data.

**Page vs Browser vs Context?**
Browser = process. Context = isolated session. Page = tab.

**How do you wait for API during UI?**

```ts
const [response] = await Promise.all([
  page.waitForResponse((r) => r.url().includes('/api/products')),
  store.search(term),
]);
```

**JS vs TS?**
TS is a typed superset. Same runtime. We compile (or use Playwright's TS loader) then run JS.

**sync vs async?**
Node is single-threaded; I/O is async. Playwright APIs are async so the runner can overlap waits.

**What is a fixture?**
Setup/teardown injected into the test function. `page` is built-in. `storeSearch` is ours.

**How is this different from Cypress?**
Playwright: multi-browser, multiple tabs/contexts, first-class API testing, traces. Cypress is more "inside the browser" and historically one tab.

---

## 8. Practice checklist before the interview

- [ ] Explain each folder in this project without opening files.
- [ ] Change a locator in `StoreHomePage` and say why specs did not change.
- [ ] Add a dataset entry and a builder method; wire a new `TEST_CASES` row.
- [ ] Trace TC-040 from spec → workflow → UI → API → `db.json`.
- [ ] Explain `===`, Promises, `async/await`, interface vs enum.
- [ ] Run `npm test` and read a failure in the HTML report.

---

## 9. Commands worth memorizing

```bash
npx playwright test
npx playwright test src/tests/api
npx playwright test --debug
npx playwright test --ui
npx playwright show-report
npx playwright codegen https://www.amazon.com
```

`codegen` is for discovery. Commit hand-written POMs, not raw codegen dumps.
