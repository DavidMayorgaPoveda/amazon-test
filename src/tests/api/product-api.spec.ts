import { expect, withApp as test } from '../../config/fixtures';
import { ProductBuilder } from '../../testdata/builders/ProductBuilder';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';
import { HttpStatus } from '../../constants/enums';
import type { IProduct } from '../../business/types';

const search = new SearchBuilder().headphones().build();
const product = new ProductBuilder().headphones().build();

test('TC-020: should list products that match the search term', async ({ productApi }) => {
  let status = 0;
  let products: IProduct[] = [];

  await test.step('Act: GET /api/products?q=', async () => {
    const result = await productApi.searchProducts(search.term);
    status = result.status;
    products = result.products;
  });

  await test.step('Assert: headphones product is returned', async () => {
    expect(status).toBe(HttpStatus.OK);
    expect(products.some((item) => item.asin === product.asin)).toBe(true);
  });
});
