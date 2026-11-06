import { expect, withApp as test } from '../../config/fixtures';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';
import { HttpStatus } from '../../constants/enums';

const search = new SearchBuilder().unknown().build();

test('TC-021: should return 404 for an unknown ASIN', async ({ productApi }) => {
  const result = await productApi.getProductByAsin('UNKNOWN-ASIN');
  expect(result.status).toBe(HttpStatus.NOT_FOUND);
});
