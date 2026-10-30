export interface IProduct {
  asin: string;
  title: string;
  price: number;
  stock: number;
  department: string;
}

export interface ISearchQuery {
  term: string;
}

export interface IFlakyRun {
  caseId: string;
  description: string;
  passOnRetry: number;
}

export interface IOrderRequest {
  asin: string;
  quantity: number;
}

export interface IOrder {
  orderId: string;
  asin: string;
  quantity: number;
  total: number;
  status: string;
}
