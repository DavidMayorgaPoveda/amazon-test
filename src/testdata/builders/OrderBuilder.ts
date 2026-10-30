import type { IOrderRequest } from '../../business/types';
import { ProductAsin } from '../../constants/enums';

export class OrderBuilder {
  private asin: string = ProductAsin.HEADPHONES;
  private quantity = 1;

  withData(data: IOrderRequest): this {
    this.asin = data.asin;
    this.quantity = data.quantity;
    return this;
  }

  headphones(): this {
    this.asin = ProductAsin.HEADPHONES;
    this.quantity = 1;
    return this;
  }

  charger(): this {
    this.asin = ProductAsin.CHARGER;
    this.quantity = 1;
    return this;
  }

  notebook(): this {
    this.asin = ProductAsin.NOTEBOOK;
    this.quantity = 1;
    return this;
  }

  build(): IOrderRequest {
    return { asin: this.asin, quantity: this.quantity };
  }
}
