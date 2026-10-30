export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  CONFLICT = 409,
}

export enum OrderStatus {
  PLACED = 'PLACED',
}

export enum OrderRejection {
  OUT_OF_STOCK = 'Out of stock',
}

export enum Department {
  ELECTRONICS = 'Electronics',
  BOOKS = 'Books',
}

export enum ProductAsin {
  HEADPHONES = 'B0STUDY01',
  CHARGER = 'B0STUDY02',
  NOTEBOOK = 'B0STUDY03',
}

export enum FlakyRun {
  INTENTIONAL_FIRST_FAILURE = 'INTENTIONAL_FIRST_FAILURE',
}
