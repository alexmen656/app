import Foundation
import Capacitor
import HealthKit

/**
 * HealthKit Plugin for Capacitor
 * Enables reading and writing nutrition data to Apple HealthKit
 */
@objc(HealthKit)
public class HealthKit: CAPPlugin {
    
    private let healthStore = HKHealthStore()
    
    // MARK: - Plugin Methods
    
    @objc func isAvailable(_ call: CAPPluginCall) {
        let available = HKHealthStore.isHealthDataAvailable()
        call.resolve(["available": available])
    }
    
    @objc func requestHealthKitPermissions(_ call: CAPPluginCall) {
        let readPermissions = call.getBool("read") ?? false
        let writePermissions = call.getBool("write") ?? false
        
        var healthKitTypes = Set<HKSampleType>()
        
        // Add nutrition types for reading/writing
        if let energyType = HKQuantityType.quantityType(forIdentifier: .dietaryEnergyConsumed) {
            healthKitTypes.insert(energyType)
        }
        if let proteinType = HKQuantityType.quantityType(forIdentifier: .dietaryProtein) {
            healthKitTypes.insert(proteinType)
        }
        if let carbsType = HKQuantityType.quantityType(forIdentifier: .dietaryCarbohydrates) {
            healthKitTypes.insert(carbsType)
        }
        if let fatType = HKQuantityType.quantityType(forIdentifier: .dietaryFatTotal) {
            healthKitTypes.insert(fatType)
        }
        
        let readTypes: Set<HKObjectType>? = readPermissions ? healthKitTypes : nil
        let writeTypes: Set<HKSampleType>? = writePermissions ? healthKitTypes : nil
        
        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Permission request failed", error.localizedDescription)
                } else {
                    call.resolve(["granted": success])
                }
            }
        }
    }
    
    @objc func writeNutritionData(_ call: CAPPluginCall) {
        let calories = call.getDouble("calories")
        let protein = call.getDouble("protein")
        let carbs = call.getDouble("carbs")
        let fat = call.getDouble("fat")
        let dateString = call.getString("date")
        
        let date: Date
        if let dateString = dateString {
            let formatter = ISO8601DateFormatter()
            date = formatter.date(from: dateString) ?? Date()
        } else {
            date = Date()
        }
        
        var samples: [HKQuantitySample] = []
        
        // Create samples for each nutrient
        if let calories = calories,
           let energyType = HKQuantityType.quantityType(forIdentifier: .dietaryEnergyConsumed) {
            let energyQuantity = HKQuantity(unit: HKUnit.kilocalorie(), doubleValue: calories)
            let energySample = HKQuantitySample(type: energyType, quantity: energyQuantity, start: date, end: date)
            samples.append(energySample)
        }
        
        if let protein = protein,
           let proteinType = HKQuantityType.quantityType(forIdentifier: .dietaryProtein) {
            let proteinQuantity = HKQuantity(unit: HKUnit.gram(), doubleValue: protein)
            let proteinSample = HKQuantitySample(type: proteinType, quantity: proteinQuantity, start: date, end: date)
            samples.append(proteinSample)
        }
        
        if let carbs = carbs,
           let carbsType = HKQuantityType.quantityType(forIdentifier: .dietaryCarbohydrates) {
            let carbsQuantity = HKQuantity(unit: HKUnit.gram(), doubleValue: carbs)
            let carbsSample = HKQuantitySample(type: carbsType, quantity: carbsQuantity, start: date, end: date)
            samples.append(carbsSample)
        }
        
        if let fat = fat,
           let fatType = HKQuantityType.quantityType(forIdentifier: .dietaryFatTotal) {
            let fatQuantity = HKQuantity(unit: HKUnit.gram(), doubleValue: fat)
            let fatSample = HKQuantitySample(type: fatType, quantity: fatQuantity, start: date, end: date)
            samples.append(fatSample)
        }
        
        if samples.isEmpty {
            call.reject("No nutrition data provided")
            return
        }
        
        healthStore.save(samples) { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Failed to save nutrition data", error.localizedDescription)
                } else {
                    call.resolve(["success": success])
                }
            }
        }
    }
    
    @objc func readNutritionData(_ call: CAPPluginCall) {
        guard let dateString = call.getString("date") else {
            call.reject("Date parameter is required")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: dateString) else {
            call.reject("Invalid date format. Use ISO8601 format")
            return
        }
        
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: date)
        let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
        
        let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: endOfDay, options: .strictStartDate)
        
        var nutritionData: [String: Double] = [:]
        let group = DispatchGroup()
        
        // Read calories
        group.enter()
        if let energyType = HKQuantityType.quantityType(forIdentifier: .dietaryEnergyConsumed) {
            let query = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
                if let sum = result?.sumQuantity() {
                    nutritionData["calories"] = sum.doubleValue(for: HKUnit.kilocalorie())
                }
                group.leave()
            }
            healthStore.execute(query)
        } else {
            group.leave()
        }
        
        // Read protein
        group.enter()
        if let proteinType = HKQuantityType.quantityType(forIdentifier: .dietaryProtein) {
            let query = HKStatisticsQuery(quantityType: proteinType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
                if let sum = result?.sumQuantity() {
                    nutritionData["protein"] = sum.doubleValue(for: HKUnit.gram())
                }
                group.leave()
            }
            healthStore.execute(query)
        } else {
            group.leave()
        }
        
        // Read carbs
        group.enter()
        if let carbsType = HKQuantityType.quantityType(forIdentifier: .dietaryCarbohydrates) {
            let query = HKStatisticsQuery(quantityType: carbsType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
                if let sum = result?.sumQuantity() {
                    nutritionData["carbs"] = sum.doubleValue(for: HKUnit.gram())
                }
                group.leave()
            }
            healthStore.execute(query)
        } else {
            group.leave()
        }
        
        // Read fat
        group.enter()
        if let fatType = HKQuantityType.quantityType(forIdentifier: .dietaryFatTotal) {
            let query = HKStatisticsQuery(quantityType: fatType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
                if let sum = result?.sumQuantity() {
                    nutritionData["fat"] = sum.doubleValue(for: HKUnit.gram())
                }
                group.leave()
            }
            healthStore.execute(query)
        } else {
            group.leave()
        }
        
        group.notify(queue: .main) {
            call.resolve(nutritionData)
        }
    }
    
    @objc func readNutritionDataRange(_ call: CAPPluginCall) {
        guard let startDateString = call.getString("startDate"),
              let endDateString = call.getString("endDate") else {
            call.reject("startDate and endDate parameters are required")
            return
        }
        
        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateString),
              let endDate = formatter.date(from: endDateString) else {
            call.reject("Invalid date format. Use ISO8601 format")
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        
        var resultData: [[String: Any]] = []
        let group = DispatchGroup()
        
        // Query each day in the range
        let calendar = Calendar.current
        var currentDate = startDate
        
        while currentDate < endDate {
            let dayStart = calendar.startOfDay(for: currentDate)
            let dayEnd = calendar.date(byAdding: .day, value: 1, to: dayStart)!
            
            let dayPredicate = HKQuery.predicateForSamples(withStart: dayStart, end: dayEnd, options: .strictStartDate)
            var dayData: [String: Any] = ["date": formatter.string(from: dayStart)]
            
            group.enter()
            
            // Query all nutrition types for this day
            let nutritionGroup = DispatchGroup()
            
            // Calories
            nutritionGroup.enter()
            if let energyType = HKQuantityType.quantityType(forIdentifier: .dietaryEnergyConsumed) {
                let query = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: dayPredicate, options: .cumulativeSum) { _, result, error in
                    if let sum = result?.sumQuantity() {
                        dayData["calories"] = sum.doubleValue(for: HKUnit.kilocalorie())
                    }
                    nutritionGroup.leave()
                }
                healthStore.execute(query)
            } else {
                nutritionGroup.leave()
            }
            
            // Protein
            nutritionGroup.enter()
            if let proteinType = HKQuantityType.quantityType(forIdentifier: .dietaryProtein) {
                let query = HKStatisticsQuery(quantityType: proteinType, quantitySamplePredicate: dayPredicate, options: .cumulativeSum) { _, result, error in
                    if let sum = result?.sumQuantity() {
                        dayData["protein"] = sum.doubleValue(for: HKUnit.gram())
                    }
                    nutritionGroup.leave()
                }
                healthStore.execute(query)
            } else {
                nutritionGroup.leave()
            }
            
            // Carbs
            nutritionGroup.enter()
            if let carbsType = HKQuantityType.quantityType(forIdentifier: .dietaryCarbohydrates) {
                let query = HKStatisticsQuery(quantityType: carbsType, quantitySamplePredicate: dayPredicate, options: .cumulativeSum) { _, result, error in
                    if let sum = result?.sumQuantity() {
                        dayData["carbs"] = sum.doubleValue(for: HKUnit.gram())
                    }
                    nutritionGroup.leave()
                }
                healthStore.execute(query)
            } else {
                nutritionGroup.leave()
            }
            
            // Fat
            nutritionGroup.enter()
            if let fatType = HKQuantityType.quantityType(forIdentifier: .dietaryFatTotal) {
                let query = HKStatisticsQuery(quantityType: fatType, quantitySamplePredicate: dayPredicate, options: .cumulativeSum) { _, result, error in
                    if let sum = result?.sumQuantity() {
                        dayData["fat"] = sum.doubleValue(for: HKUnit.gram())
                    }
                    nutritionGroup.leave()
                }
                healthStore.execute(query)
            } else {
                nutritionGroup.leave()
            }
            
            nutritionGroup.notify(queue: .main) {
                resultData.append(dayData)
                group.leave()
            }
            
            currentDate = calendar.date(byAdding: .day, value: 1, to: currentDate)!
        }
        
        group.notify(queue: .main) {
            // Sort by date
            resultData.sort { (item1, item2) in
                guard let date1String = item1["date"] as? String,
                      let date2String = item2["date"] as? String,
                      let date1 = formatter.date(from: date1String),
                      let date2 = formatter.date(from: date2String) else {
                    return false
                }
                return date1 < date2
            }
            
            call.resolve(["data": resultData])
        }
    }
}
