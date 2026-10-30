import type { Page } from '@playwright/test';

export interface ISearchResultsPage {
  getHeadingText(): Promise<string>;
  getResultCount(): Promise<number>;
  getFirstTitle(): Promise<string>;
  getAmazonUrl(): Promise<string>;
}

export class SearchResultsPage implements ISearchResultsPage {
  constructor(private readonly page: Page) {}

  private get heading() {
    return this.page.getByRole('heading', { level: 1 });
  }

  private get productCards() {
    return this.page.getByTestId('product-card');
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }

  async getResultCount(): Promise<number> {
    return this.productCards.count();
  }

  async getFirstTitle(): Promise<string> {
    return (await this.productCards.first().getByRole('heading', { level: 2 }).textContent()) ?? '';
  }

  async getAmazonUrl(): Promise<string> {
    await this.page.waitForURL(/[?&]k=/);
    return this.page.url();
  }
}
