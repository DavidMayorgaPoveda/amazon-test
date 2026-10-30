/**
 * Same idea in JavaScript vs TypeScript.
 * Open both files and compare: types, enums, autocomplete, mistakes caught early.
 */

function addPrices(a, b) {
  return a + b;
}

const product = {
  asin: 'B0STUDY01',
  title: 'Study Wireless Headphones',
  price: 29.99,
};

const total = addPrices(product.price, '1.01');

console.log('JS total (bug):', total);
console.log('typeof total:', typeof total);

async function fakeApiSearch(term) {
  const products = [product];
  return products.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()));
}

fakeApiSearch('headphones').then((hits) => {
  console.log('JS hits:', hits.length);
});
