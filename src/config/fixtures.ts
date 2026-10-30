import { test as base } from '@playwright/test';
import { makeAdapters } from '../adapters';
import { AmazonSearchWorkflow } from '../business/AmazonSearchWorkflow';
import { StoreSearchWorkflow } from '../business/StoreSearchWorkflow';
import { ProductApiWorkflow } from '../business/ProductApiWorkflow';
import { CatalogDatabaseWorkflow } from '../business/CatalogDatabaseWorkflow';

export type AppFixtures = {
  amazonSearch: AmazonSearchWorkflow;
  storeSearch: StoreSearchWorkflow;
  productApi: ProductApiWorkflow;
  catalogDb: CatalogDatabaseWorkflow;
};

export const test = base.extend<AppFixtures>({
  amazonSearch: async ({ page }, use) => {
    const adapters = makeAdapters(page.request, page);
    await use(new AmazonSearchWorkflow(adapters.ui!.amazonHome, adapters.ui!.searchResults));
  },
  storeSearch: async ({ page }, use) => {
    const adapters = makeAdapters(page.request, page);
    await use(new StoreSearchWorkflow(adapters.ui!.storeHome, adapters.ui!.searchResults));
  },
  productApi: async ({ request }, use) => {
    const adapters = makeAdapters(request);
    await use(new ProductApiWorkflow(adapters.api.products));
  },
  catalogDb: async ({ request }, use) => {
    const adapters = makeAdapters(request);
    await use(new CatalogDatabaseWorkflow(adapters.database));
  },
});

export { expect } from '@playwright/test';
export const withApp = Object.assign(test, { describe: test.describe });
