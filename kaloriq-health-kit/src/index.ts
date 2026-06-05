export * from './definitions';

import { registerPlugin } from '@capacitor/core';
import type { HealthKitPlugin } from './definitions';
import { HealthKitWeb } from './web';

const HealthKit = registerPlugin<HealthKitPlugin>('HealthKit', {
  web: () => Promise.resolve(new HealthKitWeb()),
});

export { HealthKit };
