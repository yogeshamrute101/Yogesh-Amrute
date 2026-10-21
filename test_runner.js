import { globSync } from 'fs';
import { spawnSync } from 'child_process';

const files = globSync('src/**/*.test.ts');
if (files.length === 0) {
  console.log('No tests found.');
  process.exit(0);
}

const args = ['--import', 'tsx', '--test', ...files];
const result = spawnSync('node', args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
