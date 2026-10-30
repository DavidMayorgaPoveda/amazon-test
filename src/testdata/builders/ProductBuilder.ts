import type { IProduct } from '../../business/types';
import products from '../datasets/products.json';

export class ProductBuilder {
  private product: IProduct = { ...products.HEADPHONES };

  withData(data: IProduct): this {
    this.product = { ...data };
    return this;
  }

  headphones(): this {
    this.product = { ...products.HEADPHONES };
    return this;
  }

  charger(): this {
    this.product = { ...products.CHARGER };
    return this;
  }

  notebook(): this {
    this.product = { ...products.NOTEBOOK };
    return this;
  }

  build(): IProduct {
    return { ...this.product };
  }
}
