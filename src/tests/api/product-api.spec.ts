import { expect, withApp as test } from '../../config/fixtures';
import { ProductBuilder } from '../../testdata/builders/ProductBuilder';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';
import { HttpStatus } from '../../constants/enums';
import type { IProduct } from '../../business/types';

const TEST_CASES = [
  {
    description: 'TC-020: should list products that match the search term',
    search: new SearchBuilder().headphones().build(),
    product: new ProductBuilder().headphones().build(),
    expectedStatus: HttpStatus.OK,
    unknownAsin: undefined as string | undefined,
  },
  {
    description: 'TC-021: should return 404 for an unknown ASIN',
    search: new SearchBuilder().unknown().build(),
    product: new ProductBuilder().headphones().build(),
    expectedStatus: HttpStatus.NOT_FOUND,
    unknownAsin: 'UNKNOWN-ASIN',
  },
];

test.describe('Feature: Product API', () => {
  TEST_CASES.forEach(({ description, search, product, expectedStatus, unknownAsin }) => {
    test(description, async ({ productApi }) => {
      if (unknownAsin) {
        const result = await productApi.getProductByAsin(unknownAsin);
        expect(result.status).toBe(expectedStatus);
        return;
      }

      let status = 0;
      let products: IProduct[] = [];

      await test.step('Act: GET /api/products?q=', async () => {
        const result = await productApi.searchProducts(search.term);
        status = result.status;
        products = result.products;
      });

      await test.step('Assert: headphones product is returned', async () => {
        expect(status).toBe(expectedStatus);
        expect(products.some((item) => item.asin === product.asin)).toBe(true);
      });
    });
  });
});
