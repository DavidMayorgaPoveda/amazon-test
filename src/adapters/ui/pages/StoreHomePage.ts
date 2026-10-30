import type { Page } from '@playwright/test';

export interface IStoreHomePage {
  open(): Promise<void>;
  search(term: string): Promise<void>;
  addFirstProductToCart(): Promise<void>;
  getStatusText(): Promise<string>;
}

export class StoreHomePage implements IStoreHomePage {
  constructor(private readonly page: Page) {}

  private get searchBox() {
    return this.page.getByRole('searchbox', { name: 'Search StudyMart' });
  }

  private get goButton() {
    return this.page.getByRole('button', { name: 'Go' });
  }

  private get firstAddToCart() {
    return this.page.getByTestId('product-card').first().getByRole('button', { name: 'Add to cart' });
  }

  private get status() {
    return this.page.locator('#status');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.goButton.click();
    // The results heading is updated after fetch(). Wait for it so a fast runner
    // does not read the previous heading.
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.page.getByRole('heading', { level: 1, name: new RegExp(escapedTerm, 'i') }).waitFor();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.firstAddToCart.click();
  }

  async getStatusText(): Promise<string> {
    const confirmation = this.page.locator('#status', {
      hasText: /Order ORD-|Out of stock|not found|Invalid/,
    });
    await confirmation.waitFor();
    return (await this.status.textContent()) ?? '';
  }
}
