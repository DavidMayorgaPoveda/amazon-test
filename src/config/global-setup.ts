import fs from 'node:fs';

/**
 * Clears the previous Allure results so the next report matches this run only.
 */
export default function globalSetup(): void {
  fs.rmSync('allure-results', { recursive: true, force: true });
}
