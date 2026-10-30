/**
 * TypeScript version of javascript-vs-typescript.js
 * Uncomment the bad call below to see the compiler catch it.
 */

function addPrices(a: number, b: number): number {
  return a + b;
}

interface IDemoProduct {
  asin: string;
  title: string;
  price: number;
}

const product: IDemoProduct = {
  asin: 'B0STUDY01',
  title: 'Study Wireless Headphones',
  price: 29.99,
};

const total = addPrices(product.price, 1.01);
// const broken = addPrices(product.price, '1.01'); // TS2322: string is not assignable to number

console.log('TS total (number):', total);

async function fakeApiSearch(term: string): Promise<IDemoProduct[]> {
  const products: IDemoProduct[] = [product];
  return products.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()));
}

void fakeApiSearch('headphones').then((hits) => {
  console.log('TS hits:', hits.length);
});
