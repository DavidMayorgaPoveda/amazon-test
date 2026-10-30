import { expect, withApp as test } from '../../config/fixtures';
import { ProductBuilder } from '../../testdata/builders/ProductBuilder';
import { Department } from '../../constants/enums';
import type { IProduct } from '../../business/types';

const TEST_CASES = [
  {
    description: 'TC-030: should read headphones catalog row from the database file',
    product: new ProductBuilder().headphones().build(),
  },
];

test.describe('Feature: Catalog database', () => {
  TEST_CASES.forEach(({ description, product }) => {
    test(description, async ({ catalogDb }) => {
      let row: IProduct | undefined;

      await test.step('Act: query product by ASIN', async () => {
        row = catalogDb.getProduct(product.asin);
      });

      await test.step('Assert: stored title, price, and department match dataset', async () => {
        expect(row).toBeDefined();
        expect(row?.title).toBe(product.title);
        expect(row?.price).toBe(product.price);
        expect(row?.department).toBe(Department.ELECTRONICS);
      });
    });
  });
});
