import { strict as assert } from 'node:assert';
import { cache, intercept } from '../../build/index.js';

assert(typeof cache === 'function');
assert(typeof intercept === 'function');

console.log('MJS import test passed');
