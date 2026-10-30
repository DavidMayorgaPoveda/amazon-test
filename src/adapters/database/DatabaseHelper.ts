import fs from 'fs';
import path from 'path';
import type { IOrder, IProduct } from '../../business/types';

interface IDatabaseFile {
  products: IProduct[];
  orders: IOrder[];
}

export interface IDatabaseHelper {
  getProductByAsin(asin: string): IProduct | undefined;
  getOrdersByAsin(asin: string): IOrder[];
  setStock(asin: string, stock: number): void;
}

export class DatabaseHelper implements IDatabaseHelper {
  private readonly dbPath = path.join(__dirname, '../../../app/db.json');

  private read(): IDatabaseFile {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf8')) as IDatabaseFile;
  }

  private write(db: IDatabaseFile): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2));
  }

  getProductByAsin(asin: string): IProduct | undefined {
    return this.read().products.find((product) => product.asin === asin);
  }

  getOrdersByAsin(asin: string): IOrder[] {
    return this.read().orders.filter((order) => order.asin === asin);
  }

  setStock(asin: string, stock: number): void {
    const db = this.read();
    const product = db.products.find((item) => item.asin === asin);
    if (!product) {
      return;
    }
    product.stock = stock;
    this.write(db);
  }
}
