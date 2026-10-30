import { expect, withApp as test } from '../../config/fixtures';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';

const TEST_CASES = [
  { description: 'TC-001: should return local catalog results for headphones', data: new SearchBuilder().headphones().build() },
];

test.describe('Feature: StudyMart search (local Amazon-style UI)', () => {
  TEST_CASES.forEach(({ description, data }) => {
    test(description, async ({ storeSearch }) => {
      let result: { heading: string; count: number; firstTitle: string };

      await test.step('Arrange: search term from dataset', async () => {
        expect(data.term).toBeTruthy();
      });

      await test.step('Act: search in the local store', async () => {
        result = await storeSearch.searchCatalog(data);
      });

      await test.step('Assert: heading and product cards match the query', async () => {
        expect(result.heading.toLowerCase()).toContain(data.term);
        expect(result.count).toBeGreaterThan(0);
        expect(result.firstTitle.toLowerCase()).toContain(data.term);
      });
    });
  });
});
