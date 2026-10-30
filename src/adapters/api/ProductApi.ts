import type { APIRequestContext } from '@playwright/test';
import type { IOrder, IOrderRequest, IProduct } from '../../business/types';

export interface IProductApi {
  listProducts(query?: string): Promise<{ status: number; body: IProduct[] }>;
  getProduct(asin: string): Promise<{ status: number; body: IProduct | { error: string } }>;
  createOrder(order: IOrderRequest): Promise<{ status: number; body: IOrder | { error: string } }>;
}

export class ProductApi implements IProductApi {
  constructor(private readonly request: APIRequestContext) {}

  async listProducts(query?: string): Promise<{ status: number; body: IProduct[] }> {
    const suffix = query ? `?q=${encodeURIComponent(query)}` : '';
    const response = await this.request.get(`/api/products${suffix}`);
    return { status: response.status(), body: await response.json() };
  }

  async getProduct(asin: string): Promise<{ status: number; body: IProduct | { error: string } }> {
    const response = await this.request.get(`/api/products/${asin}`);
    return { status: response.status(), body: await response.json() };
  }

  async createOrder(order: IOrderRequest): Promise<{ status: number; body: IOrder | { error: string } }> {
    const response = await this.request.post('/api/orders', { data: order });
    return { status: response.status(), body: await response.json() };
  }
}
