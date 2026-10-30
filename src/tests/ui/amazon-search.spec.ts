import { expect, withApp as test } from '../../config/fixtures';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';

const TEST_CASES = [
  {
    description: 'TC-010 @live: should search wireless headphones on amazon.com',
    data: new SearchBuilder().amazonHeadphones().build(),
  },
];

test.describe('Feature: Amazon.com search (live, interview demo)', () => {
  TEST_CASES.forEach(({ description, data }) => {
    test(description, async ({ amazonSearch }) => {
      let url = '';

      await test.step('Act: search on amazon.com', async () => {
        const result = await amazonSearch.searchOnAmazon(data);
        url = result.url;
      });

      await test.step('Assert: results URL includes the keyword', async () => {
        expect(url).toMatch(/amazon\.com/);
        expect(decodeURIComponent(url).toLowerCase()).toContain('headphones');
      });
    });
  });
});
