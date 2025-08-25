#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(HealthKit, "HealthKit",
           CAP_PLUGIN_METHOD(isAvailable, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(requestHealthKitPermissions, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(writeNutritionData, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(readNutritionData, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(readNutritionDataRange, CAPPluginReturnPromise);
)
