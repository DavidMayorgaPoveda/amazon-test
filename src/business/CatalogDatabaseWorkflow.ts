import type { IDatabaseHelper } from '../adapters/database/DatabaseHelper';
import type { IOrder, IProduct } from './types';

export class CatalogDatabaseWorkflow {
  constructor(private readonly database: IDatabaseHelper) {}

  getProduct(asin: string): IProduct | undefined {
    return this.database.getProductByAsin(asin);
  }

  getOrders(asin: string): IOrder[] {
    return this.database.getOrdersByAsin(asin);
  }

  restoreStock(asin: string, stock: number): void {
    this.database.setStock(asin, stock);
  }
}
