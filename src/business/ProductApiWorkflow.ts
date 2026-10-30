import type { IProductApi } from '../adapters/api/ProductApi';
import type { IOrder, IOrderRequest, IProduct } from './types';

export class ProductApiWorkflow {
  constructor(private readonly api: IProductApi) {}

  async searchProducts(term: string): Promise<{ status: number; products: IProduct[] }> {
    const result = await this.api.listProducts(term);
    return { status: result.status, products: result.body };
  }

  async getProductByAsin(asin: string): Promise<{ status: number; body: IProduct | { error: string } }> {
    return this.api.getProduct(asin);
  }

  async placeOrder(order: IOrderRequest): Promise<{ status: number; body: IOrder | { error: string } }> {
    return this.api.createOrder(order);
  }
}
