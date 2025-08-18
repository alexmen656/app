// iOS Widget Templates (these would be used by SwiftUI widgets)

// Small Widget - Calories Ring
export const SMALL_WIDGET_TEMPLATE = `
struct SmallCaloriesWidget: View {
    let calories: Int
    let target: Int
    let progress: Double
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            VStack(spacing: 8) {
                // Progress Ring
                ZStack {
                    Circle()
                        .stroke(Color.white.opacity(0.2), lineWidth: 6)
                        .frame(width: 60, height: 60)
                    
                    Circle()
                        .trim(from: 0, to: CGFloat(progress))
                        .stroke(Color.white, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                        .frame(width: 60, height: 60)
                        .rotationEffect(.degrees(-90))
                    
                    Image(systemName: "flame.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 16))
                }
                
                VStack(spacing: 2) {
                    Text("\\(calories)")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("of \\(target) kcal")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }
            }
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}
`;

// Medium Widget - Macros Overview
export const MEDIUM_WIDGET_TEMPLATE = `
struct MediumMacrosWidget: View {
    let calories: Int
    let target: Int
    let protein: Int
    let carbs: Int
    let fats: Int
    let proteinProgress: Double
    let carbsProgress: Double
    let fatsProgress: Double
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            HStack(spacing: 16) {
                // Calories Section
                VStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .stroke(Color.white.opacity(0.2), lineWidth: 4)
                            .frame(width: 50, height: 50)
                        
                        Circle()
                            .trim(from: 0, to: CGFloat(Double(calories) / Double(target)))
                            .stroke(Color.white, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                            .frame(width: 50, height: 50)
                            .rotationEffect(.degrees(-90))
                        
                        Image(systemName: "flame.fill")
                            .foregroundColor(.white)
                            .font(.system(size: 12))
                    }
                    
                    VStack(spacing: 2) {
                        Text("\\(calories)")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Text("kcal")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                
                // Macros Section
                VStack(spacing: 12) {
                    HStack(spacing: 16) {
                        MacroRing(value: protein, progress: proteinProgress, color: Color(hex: "ff6b6b"), label: "P")
                        MacroRing(value: carbs, progress: carbsProgress, color: Color(hex: "ffa726"), label: "C")
                        MacroRing(value: fats, progress: fatsProgress, color: Color(hex: "42a5f5"), label: "F")
                    }
                }
            }
            .padding()
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}

struct MacroRing: View {
    let value: Int
    let progress: Double
    let color: Color
    let label: String
    
    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 3)
                    .frame(width: 30, height: 30)
                
                Circle()
                    .trim(from: 0, to: CGFloat(progress))
                    .stroke(color, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                    .frame(width: 30, height: 30)
                    .rotationEffect(.degrees(-90))
                
                Text(label)
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(color)
            }
            
            Text("\\(value)g")
                .font(.system(size: 8, weight: .medium))
                .foregroundColor(.white)
        }
    }
}
`;

// Large Widget - Daily Overview with Recent Foods
export const LARGE_WIDGET_TEMPLATE = `
struct LargeOverviewWidget: View {
    let calories: Int
    let target: Int
    let protein: Int
    let carbs: Int
    let fats: Int
    let streak: Int
    let recentFoods: [WidgetFood]
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            VStack(spacing: 16) {
                // Header with streak
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Kaloriq")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("Daily Progress")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.7))
                    }
                    
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Image(systemName: "flame.fill")
                            .foregroundColor(Color(hex: "ff6b35"))
                            .font(.system(size: 12))
                        
                        Text("\\(streak)")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(12)
                }
                
                // Main calories and macros
                HStack(spacing: 20) {
                    // Calories ring
                    VStack(spacing: 8) {
                        ZStack {
                            Circle()
                                .stroke(Color.white.opacity(0.2), lineWidth: 6)
                                .frame(width: 70, height: 70)
                            
                            Circle()
                                .trim(from: 0, to: CGFloat(Double(calories) / Double(target)))
                                .stroke(Color.white, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                                .frame(width: 70, height: 70)
                                .rotationEffect(.degrees(-90))
                            
                            VStack(spacing: 2) {
                                Text("\\(calories)")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                                Text("kcal")
                                    .font(.system(size: 10))
                                    .foregroundColor(.white.opacity(0.7))
                            }
                        }
                        
                        Text("\\(target - calories) left")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.8))
                    }
                    
                    // Macros grid
                    VStack(spacing: 8) {
                        HStack(spacing: 12) {
                            MacroColumn(value: protein, label: "Protein", color: Color(hex: "ff6b6b"))
                            MacroColumn(value: carbs, label: "Carbs", color: Color(hex: "ffa726"))
                            MacroColumn(value: fats, label: "Fats", color: Color(hex: "42a5f5"))
                        }
                    }
                }
                
                // Recent foods
                if !recentFoods.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Recent")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                        
                        VStack(spacing: 4) {
                            ForEach(recentFoods.prefix(3), id: \\.name) { food in
                                HStack {
                                    Text(food.name)
                                        .font(.system(size: 11))
                                        .foregroundColor(.white)
                                        .lineLimit(1)
                                    
                                    Spacer()
                                    
                                    Text("\\(food.calories) kcal")
                                        .font(.system(size: 10, weight: .medium))
                                        .foregroundColor(.white.opacity(0.7))
                                }
                            }
                        }
                    }
                }
            }
            .padding()
        }
        .containerBackground(for: .widget) {
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "1e1e2e"), Color(hex: "2a2d37")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }
}

struct MacroColumn: View {
    let value: Int
    let label: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Text("\\(value)g")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(color)
            
            Text(label)
                .font(.system(size: 9))
                .foregroundColor(.white.opacity(0.7))
        }
    }
}

struct WidgetFood {
    let name: String
    let calories: Int
}
`;

// Widget Configuration
export const WIDGET_CONFIG = `
import WidgetKit
import SwiftUI

// Widget Entry
struct KaloriqEntry: TimelineEntry {
    let date: Date
    let calories: Int
    let target: Int
    let progress: Double
    let protein: Int
    let carbs: Int
    let fats: Int
    let proteinProgress: Double
    let carbsProgress: Double
    let fatsProgress: Double
    let streak: Int
    let recentFoods: [WidgetFood]
}

// Widget Provider
struct KaloriqProvider: TimelineProvider {
    func placeholder(in context: Context) -> KaloriqEntry {
        KaloriqEntry(
            date: Date(),
            calories: 1800,
            target: 2500,
            progress: 0.72,
            protein: 120,
            carbs: 180,
            fats: 60,
            proteinProgress: 0.8,
            carbsProgress: 0.6,
            fatsProgress: 0.75,
            streak: 15,
            recentFoods: [
                WidgetFood(name: "Chicken Breast", calories: 350),
                WidgetFood(name: "Brown Rice", calories: 220),
                WidgetFood(name: "Greek Yogurt", calories: 150)
            ]
        )
    }
    
    func getSnapshot(in context: Context, completion: @escaping (KaloriqEntry) -> ()) {
        let entry = placeholder(in: context)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Read data from Capacitor Preferences
        let widgetData = getWidgetDataFromPreferences()
        
        let entry = KaloriqEntry(
            date: Date(),
            calories: widgetData.calories.current,
            target: widgetData.calories.target,
            progress: widgetData.calories.progress,
            protein: widgetData.macros.protein.current,
            carbs: widgetData.macros.carbs.current,
            fats: widgetData.macros.fats.current,
            proteinProgress: widgetData.macros.protein.progress,
            carbsProgress: widgetData.macros.carbs.progress,
            fatsProgress: widgetData.macros.fats.progress,
            streak: widgetData.streak,
            recentFoods: widgetData.todayFoods.map { WidgetFood(name: $0.name, calories: $0.calories) }
        )
        
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }
    
    private func getWidgetDataFromPreferences() -> WidgetData {
        // This would read from Capacitor Preferences using shared app groups
        // Implementation depends on iOS setup
        return placeholder(in: Context()).widgetData
    }
}

// Widget Configuration
struct KaloriqWidget: Widget {
    let kind: String = "KaloriqWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: KaloriqProvider()) { entry in
            KaloriqWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Kaloriq")
        .description("Track your daily nutrition goals.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// Widget Entry View
struct KaloriqWidgetEntryView: View {
    var entry: KaloriqProvider.Entry

    var body: some View {
        switch entry.family {
        case .systemSmall:
            SmallCaloriesWidget(
                calories: entry.calories,
                target: entry.target,
                progress: entry.progress
            )
        case .systemMedium:
            MediumMacrosWidget(
                calories: entry.calories,
                target: entry.target,
                protein: entry.protein,
                carbs: entry.carbs,
                fats: entry.fats,
                proteinProgress: entry.proteinProgress,
                carbsProgress: entry.carbsProgress,
                fatsProgress: entry.fatsProgress
            )
        case .systemLarge:
            LargeOverviewWidget(
                calories: entry.calories,
                target: entry.target,
                protein: entry.protein,
                carbs: entry.carbs,
                fats: entry.fats,
                streak: entry.streak,
                recentFoods: entry.recentFoods
            )
        default:
            SmallCaloriesWidget(
                calories: entry.calories,
                target: entry.target,
                progress: entry.progress
            )
        }
    }
}

// Color extension for hex colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
`;

// Usage Instructions
export const WIDGET_SETUP_INSTRUCTIONS = `
# iOS Widget Setup Instructions

## 1. Add Widget Extension to iOS Project

1. Open your iOS project in Xcode
2. Add a new Widget Extension target:
   - File → New → Target
   - Choose "Widget Extension"
   - Name it "KaloriqWidget"

## 2. Configure App Groups

1. Add App Groups capability to both main app and widget:
   - Select your app target → Capabilities → App Groups
   - Add group: group.com.yourcompany.kaloriq.shared

2. Configure Capacitor Preferences to use App Groups:
   - Add to capacitor.config.ts:
   \`\`\`typescript
   plugins: {
     Preferences: {
       group: "group.com.yourcompany.kaloriq.shared"
     }
   }
   \`\`\`

## 3. Add Widget Code

1. Replace the generated widget code with the templates above
2. Ensure both targets have the same App Group configured
3. Build and run

## 4. Widget Data Flow

1. Vue app saves data to Capacitor Preferences with shared group
2. Widget reads data from shared preferences
3. Widget updates automatically when data changes

## 5. Testing

1. Add widget to home screen
2. Log food in the app
3. Widget should update with new data
4. Test all three widget sizes (small, medium, large)

The widgets will display:
- Small: Calorie ring with progress
- Medium: Calories + macro rings
- Large: Full overview with recent foods and streak
`;

export default {
  SMALL_WIDGET_TEMPLATE,
  MEDIUM_WIDGET_TEMPLATE,
  LARGE_WIDGET_TEMPLATE,
  WIDGET_CONFIG,
  WIDGET_SETUP_INSTRUCTIONS
};
