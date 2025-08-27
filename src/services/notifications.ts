import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export interface NotificationSettings {
  enabled: boolean
  breakfast: { enabled: boolean; time: string }
  lunch: { enabled: boolean; time: string }
  dinner: { enabled: boolean; time: string }
  snacks: { enabled: boolean; time: string }
}

export class NotificationService {
  private static defaultSettings: NotificationSettings = {
    enabled: false,
    breakfast: { enabled: true, time: '08:00' },
    lunch: { enabled: true, time: '12:30' },
    dinner: { enabled: true, time: '19:00' },
    snacks: { enabled: false, time: '15:30' }
  }

  static async initialize(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications are only available on native platforms')
      return false
    }

    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions()
      
      if (permission.display === 'granted') {
        console.log('✅ Notification permissions granted')
        return true
      } else {
        console.log('❌ Notification permissions denied')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
      return false
    }
  }

  static async scheduleAllMealNotifications(settings: NotificationSettings): Promise<void> {
    if (!settings.enabled) {
      await this.cancelAllNotifications()
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
        console.log(`✅ ${notifications.length} meal notifications scheduled`)
      }

    } catch (error) {
      console.error('Error scheduling notifications:', error)
      throw error
    }
  }

  private static createMealNotification(
    id: number,
    title: string,
    body: string,
    time: string
  ): LocalNotificationSchema {
    const [hours, minutes] = time.split(':').map(Number)
    
    return {
      id,
      title,
      body,
      largeBody: body,
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
        mealType: id === 1 ? 'breakfast' : id === 2 ? 'lunch' : id === 3 ? 'dinner' : 'snack'
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
        console.log(`✅ Cancelled ${pending.notifications.length} notifications`)
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
}
