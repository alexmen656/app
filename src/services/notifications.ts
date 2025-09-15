import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { getCurrentLanguage } from '../i18n'

export interface NotificationSettings {
  enabled: boolean
  breakfast: { enabled: boolean; time: string }
  lunch: { enabled: boolean; time: string }
  dinner: { enabled: boolean; time: string }
  snacks: { enabled: boolean; time: string }
  inactivityReminders: boolean
}

export class NotificationService {
  private static defaultSettings: NotificationSettings = {
    enabled: false,
    breakfast: { enabled: true, time: '08:00' },
    lunch: { enabled: true, time: '12:30' },
    dinner: { enabled: true, time: '19:00' },
    snacks: { enabled: false, time: '15:30' },
    inactivityReminders: true
  }

  static async initialize(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
     //console.log('Notifications are only available on native platforms')
      return false
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions()
      
      if (permission.display === 'granted') {
       //console.log('✅ Notification permissions granted')
        return true
      } else {
       //console.log('❌ Notification permissions denied')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
      return false
    }
  }

  static async requestPermissions(): Promise<{ granted: boolean }> {
    if (!Capacitor.isNativePlatform()) {
      return { granted: false }
    }

    try {
      const permission = await LocalNotifications.requestPermissions()
      return { granted: permission.display === 'granted' }
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
      return { granted: false }
    }
  }

  static async scheduleAllMealNotifications(settings: NotificationSettings): Promise<void> {
    if (!settings.enabled) {
      await this.cancelAllNotifications()
      await this.cancelInactivityReminder()
      return
    }

    try {
      // Cancel existing notifications first
      await this.cancelAllNotifications()

      const notifications: LocalNotificationSchema[] = []

      // Breakfast notification
      if (settings.breakfast.enabled) {
        notifications.push(this.createMealNotification(
          1,
          'Frühstück Zeit! 🌅',
          'Vergiss nicht dein Frühstück zu tracken für einen gesunden Start in den Tag.',
          settings.breakfast.time
        ))
      }

      // Lunch notification
      if (settings.lunch.enabled) {
        notifications.push(this.createMealNotification(
          2,
          'Mittagessen Zeit! 🍽️',
          'Zeit für das Mittagessen! Denk daran, deine Mahlzeit zu scannen.',
          settings.lunch.time
        ))
      }

      // Dinner notification
      if (settings.dinner.enabled) {
        notifications.push(this.createMealNotification(
          3,
          'Abendessen Zeit! 🌙',
          'Dein Abendessen wartet! Vergiss nicht es in Kaloriq zu tracken.',
          settings.dinner.time
        ))
      }

      // Snacks notification
      if (settings.snacks.enabled) {
        notifications.push(this.createMealNotification(
          4,
          'Snack Zeit! 🍎',
          'Zeit für einen gesunden Snack! Tracke ihn in Kaloriq.',
          settings.snacks.time
        ))
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({
          notifications: notifications
        })
       //console.log(`✅ ${notifications.length} meal notifications scheduled`)
      }

      // Handle inactivity reminders
      if (settings.inactivityReminders) {
        await this.scheduleInactivityReminder()
       //console.log('✅ Inactivity reminders enabled')
      } else {
        await this.cancelInactivityReminder()
       //console.log('❌ Inactivity reminders disabled')
      }

    } catch (error) {
      console.error('Error scheduling notifications:', error)
      throw error
    }
  }

  private static createMealNotification(
    id: number,
    _title: string,
    _body: string,
    time: string
  ): LocalNotificationSchema {
    const [hours, minutes] = time.split(':').map(Number)
    
    // Get localized messages
    const language = getCurrentLanguage()
    const messages = this.getNotificationMessages(language)
    
    // Map meal types to localized messages
    const mealType = id === 1 ? 'breakfast' : id === 2 ? 'lunch' : id === 3 ? 'dinner' : 'snack'
    const localizedMessage = messages[mealType as keyof typeof messages]
    
    return {
      id,
      title: localizedMessage.title,
      body: localizedMessage.body,
      largeBody: localizedMessage.body,
      summaryText: 'Kaloriq Meal Reminder',
      smallIcon: 'ic_launcher',
      iconColor: '#007052',
      sound: 'default',
      schedule: {
        on: {
          hour: hours,
          minute: minutes
        },
        allowWhileIdle: true,
        repeats: true
      },
      actionTypeId: 'MEAL_REMINDER',
      extra: {
        mealType
      }
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      // Get all pending notifications
      const pending = await LocalNotifications.getPending()
      
      if (pending.notifications.length > 0) {
        // Cancel all notifications
        await LocalNotifications.cancel({ 
          notifications: pending.notifications.map(n => ({ id: n.id }))
        })
       //console.log(`✅ Cancelled ${pending.notifications.length} notifications`)
      }
    } catch (error) {
      console.error('Error cancelling notifications:', error)
    }
  }

  static async getPendingNotifications() {
    try {
      return await LocalNotifications.getPending()
    } catch (error) {
      console.error('Error getting pending notifications:', error)
      return { notifications: [] }
    }
  }

  static getDefaultSettings(): NotificationSettings {
    return { ...this.defaultSettings }
  }

  // Helper to check if notifications are supported
  static isSupported(): boolean {
    return Capacitor.isNativePlatform()
  }

  // Inactivity notifications management
  static async scheduleInactivityReminder(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return

    try {
      // Cancel any existing inactivity reminder
      await this.cancelInactivityReminder()

      // Get current language for localized messages
      const language = getCurrentLanguage()
      const messages = this.getNotificationMessages(language)

      const now = new Date()
      const currentHour = now.getHours()
      
      // Don't schedule during quiet hours (22:00-7:00)
      if (currentHour >= 22 || currentHour < 7) {
       //console.log('⏰ Currently in quiet hours (22:00-7:00), no inactivity reminder scheduled')
        return
      }

      // Calculate 8 hours from now, but exclude quiet hours
      let reminderTime = this.calculateReminderTimeExcludingQuietHours(now)

      // If the calculated time falls in quiet hours, schedule for next active period (7:00 AM)
      const reminderHour = reminderTime.getHours()
      if (reminderHour >= 22 || reminderHour < 7) {
        // Schedule for 7:00 AM next day
        reminderTime = new Date(reminderTime)
        if (reminderHour < 7) {
          // Same day 7:00 AM
          reminderTime.setHours(7, 0, 0, 0)
        } else {
          // Next day 7:00 AM
          reminderTime.setDate(reminderTime.getDate() + 1)
          reminderTime.setHours(7, 0, 0, 0)
        }
      }

      const notification: LocalNotificationSchema = {
        id: 999, // Special ID for inactivity reminders
        title: messages.inactivity.title,
        body: messages.inactivity.body,
        largeBody: messages.inactivity.body,
        summaryText: 'Kaloriq Activity Reminder',
        smallIcon: 'ic_launcher',
        iconColor: '#007052',
        sound: 'default',
        schedule: {
          at: reminderTime
        },
        actionTypeId: 'INACTIVITY_REMINDER',
        extra: {
          type: 'inactivity'
        }
      }

      await LocalNotifications.schedule({
        notifications: [notification]
      })

     //console.log(`⏰ Inactivity reminder scheduled for ${reminderTime.toLocaleString()}`)
    } catch (error) {
      console.error('Error scheduling inactivity reminder:', error)
    }
  }

  // Calculate reminder time excluding quiet hours (22:00-7:00)
  private static calculateReminderTimeExcludingQuietHours(startTime: Date): Date {
    const result = new Date(startTime)
    let hoursToAdd = 8
    
    while (hoursToAdd > 0) {
      result.setHours(result.getHours() + 1)
      const currentHour = result.getHours()
      
      // Only count hours that are NOT in quiet time (22:00-7:00)
      if (currentHour >= 7 && currentHour < 22) {
        hoursToAdd--
      }
    }
    
    return result
  }

  static async cancelInactivityReminder(): Promise<void> {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: 999 }]
      })
    } catch (error) {
      console.error('Error cancelling inactivity reminder:', error)
    }
  }

  static async resetInactivityTimer(): Promise<void> {
    // This should be called whenever the user scans something
    // Cancel current timer and start a new one if inactivity reminders are enabled
    
    try {
      const now = new Date()
      const currentHour = now.getHours()
      
      // Don't start timer during quiet hours
      if (currentHour >= 22 || currentHour < 7) {
       //console.log('⏰ In quiet hours, inactivity timer not started')
        await this.cancelInactivityReminder()
        return
      }
      
      // Import here to avoid circular dependencies
      const { getNotificationSettings } = await import('../stores/preferencesStore')
      const settings = await getNotificationSettings()
      
      if (settings.enabled && settings.inactivityReminders) {
        await this.scheduleInactivityReminder()
       //console.log('⏰ Inactivity timer reset and restarted')
      } else {
        await this.cancelInactivityReminder()
       //console.log('⏰ Inactivity reminders disabled, timer cancelled')
      }
    } catch (error) {
      console.error('Error resetting inactivity timer:', error)
    }
  }

  private static getNotificationMessages(language: string) {
    const messages = {
      en: {
        breakfast: {
          title: "Breakfast Time! 🌅",
          body: "Don't forget to track your breakfast for a healthy start to your day."
        },
        lunch: {
          title: "Lunch Time! 🍽️", 
          body: "Time for lunch! Remember to scan your meal."
        },
        dinner: {
          title: "Dinner Time! 🌙",
          body: "Your dinner awaits! Don't forget to track it in Kaloriq."
        },
        snack: {
          title: "Snack Time! 🍎",
          body: "Time for a healthy snack! Track it in Kaloriq."
        },
        inactivity: {
          title: "Time to track! ⏰",
          body: "You haven't scanned anything today. Open Kaloriq and track your meals!"
        }
      },
      de: {
        breakfast: {
          title: "Frühstück Zeit! 🌅",
          body: "Vergiss nicht dein Frühstück zu tracken für einen gesunden Start in den Tag."
        },
        lunch: {
          title: "Mittagessen Zeit! 🍽️",
          body: "Zeit für das Mittagessen! Denk daran, deine Mahlzeit zu scannen."
        },
        dinner: {
          title: "Abendessen Zeit! 🌙",
          body: "Dein Abendessen wartet! Vergiss nicht es in Kaloriq zu tracken."
        },
        snack: {
          title: "Snack Zeit! 🍎",
          body: "Zeit für einen gesunden Snack! Tracke ihn in Kaloriq."
        },
        inactivity: {
          title: "Zeit zu tracken! ⏰",
          body: "Du hast heute noch nichts gescannt. Öffne Kaloriq und tracke deine Mahlzeiten!"
        }
      }
    }

    return messages[language as keyof typeof messages] || messages.en
  }
}
