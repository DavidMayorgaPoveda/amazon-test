import type { IAmazonHomePage } from '../adapters/ui/pages/AmazonHomePage';
import type { ISearchResultsPage } from '../adapters/ui/pages/SearchResultsPage';
import type { ISearchQuery } from './types';

export class AmazonSearchWorkflow {
  constructor(
    private readonly home: IAmazonHomePage,
    private readonly results: ISearchResultsPage,
  ) {}

  async searchOnAmazon(query: ISearchQuery): Promise<{ url: string }> {
    await this.home.open();
    await this.home.search(query.term);
    const url = await this.results.getAmazonUrl();
    return { url };
  }
}
