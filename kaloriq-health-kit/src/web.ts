import { WebPlugin } from '@capacitor/core';
import { HealthKitPlugin, HealthData, HealthKitPermissions } from './definitions';

export class HealthKitWeb extends WebPlugin implements HealthKitPlugin {
  constructor() {
    super({
      name: 'HealthKit',
      platforms: ['web'],
    });
  }

  async isAvailable(): Promise<{ available: boolean }> {
    // HealthKit is not available on web
    return { available: false };
  }

  async requestHealthKitPermissions(options: HealthKitPermissions): Promise<{ granted: boolean }> {
    console.log('HealthKit permissions not available on web', options);
    return { granted: false };
  }

  async writeNutritionData(options: HealthData): Promise<{ success: boolean }> {
    console.log('HealthKit write not available on web', options);
    return { success: false };
  }

  async readNutritionData(options: { date: string }): Promise<HealthData> {
    console.log('HealthKit read not available on web', options);
    return {};
  }

  async readNutritionDataRange(options: { startDate: string; endDate: string }): Promise<{ data: HealthData[] }> {
    console.log('HealthKit read range not available on web', options);
    return { data: [] };
  }
}

const HealthKit = new HealthKitWeb();

export { HealthKit };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(HealthKit);
