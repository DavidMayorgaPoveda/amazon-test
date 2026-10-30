import type { Page } from '@playwright/test';

export interface IAmazonHomePage {
  open(): Promise<void>;
  search(term: string): Promise<void>;
}

export class AmazonHomePage implements IAmazonHomePage {
  constructor(private readonly page: Page) {}

  private get searchBox() {
    return this.page.getByRole('searchbox', { name: 'Search Amazon' });
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.amazon.com/');
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }
}
