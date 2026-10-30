import { expect, withApp as test } from '../../config/fixtures';
import { FlakyRunBuilder } from '../../testdata/builders/FlakyRunBuilder';

const scenario = new FlakyRunBuilder().intentionalFirstFailure().build();

test.describe('Feature: Intentional flake', () => {
  test.describe.configure({ retries: scenario.passOnRetry });

  test(`${scenario.caseId}: ${scenario.description}`, async ({}, testInfo) => {
    await test.step('Assert: pass only after the first attempt fails', async () => {
      expect(testInfo.retry).toBe(scenario.passOnRetry);
    });
  });
});
