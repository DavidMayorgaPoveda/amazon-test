import type { IStoreHomePage } from '../adapters/ui/pages/StoreHomePage';
import type { ISearchResultsPage } from '../adapters/ui/pages/SearchResultsPage';
import type { ISearchQuery } from './types';

export class StoreSearchWorkflow {
  constructor(
    private readonly store: IStoreHomePage,
    private readonly results: ISearchResultsPage,
  ) {}

  async searchCatalog(query: ISearchQuery): Promise<{ heading: string; count: number; firstTitle: string }> {
    await this.store.open();
    await this.store.search(query.term);
    return {
      heading: await this.results.getHeadingText(),
      count: await this.results.getResultCount(),
      firstTitle: await this.results.getFirstTitle(),
    };
  }

  async searchAndPlaceOrder(query: ISearchQuery): Promise<{ status: string }> {
    await this.searchCatalog(query);
    await this.store.addFirstProductToCart();
    return { status: await this.store.getStatusText() };
  }
}
