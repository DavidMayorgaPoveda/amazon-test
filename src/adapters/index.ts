import type { APIRequestContext, Page } from '@playwright/test';
import { AmazonHomePage, type IAmazonHomePage } from './ui/pages/AmazonHomePage';
import { SearchResultsPage, type ISearchResultsPage } from './ui/pages/SearchResultsPage';
import { StoreHomePage, type IStoreHomePage } from './ui/pages/StoreHomePage';
import { ProductApi, type IProductApi } from './api/ProductApi';
import { DatabaseHelper, type IDatabaseHelper } from './database/DatabaseHelper';

export type AppAdapters = {
  ui?: {
    amazonHome: IAmazonHomePage;
    searchResults: ISearchResultsPage;
    storeHome: IStoreHomePage;
  };
  api: {
    products: IProductApi;
  };
  database: IDatabaseHelper;
};

export function makeAdapters(request: APIRequestContext, page?: Page): AppAdapters {
  return {
    ui: page
      ? {
          amazonHome: new AmazonHomePage(page),
          searchResults: new SearchResultsPage(page),
          storeHome: new StoreHomePage(page),
        }
      : undefined,
    api: {
      products: new ProductApi(request),
    },
    database: new DatabaseHelper(),
  };
}
