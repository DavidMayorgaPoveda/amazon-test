import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve('@playwright/test/cli');
const args = process.argv.slice(2);
const openReport = args.includes('--open-report');
const playwrightArgs = args.filter((arg) => arg !== '--open-report');

const test = spawnSync(process.execPath, [playwrightCli, 'test', ...playwrightArgs], {
  stdio: 'inherit',
});

fs.rmSync('allure-report', { recursive: true, force: true });
spawnSync('npx allure generate ./allure-results', {
  stdio: 'inherit',
  shell: true,
});

if (openReport) {
  spawnSync('npx allure open ./allure-report', {
    stdio: 'inherit',
    shell: true,
  });
}

process.exit(test.status ?? 1);
