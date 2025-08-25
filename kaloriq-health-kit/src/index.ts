export * from './definitions';
export * from './web';

import { Plugins } from '@capacitor/core';
import { HealthKitPlugin } from './definitions';

const { HealthKit } = Plugins as any;

export { HealthKit };
