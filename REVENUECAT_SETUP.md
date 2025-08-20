# RevenueCat Setup Guide for Kaloriq

This guide will help you set up RevenueCat for your Kaloriq app to enable in-app purchases and subscriptions.

## 1. RevenueCat Account Setup

1. Visit [RevenueCat](https://www.revenuecat.com/) and create an account
2. Create a new project for your Kaloriq app
3. Note down your **public API key** (you'll need this later)

## 2. App Store Connect Setup (iOS)

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create your app if you haven't already
3. Go to "Features" → "In-App Purchases"
4. Create subscription products with the following IDs:
   - `monthly_premium` - Monthly subscription
   - `annual_premium` - Annual subscription 
   - `lifetime_premium` - Lifetime purchase (one-time)

### Recommended Product Configuration:
- **Monthly**: $4.99/month
- **Annual**: $29.99/year (50% savings)
- **Lifetime**: $99.99 one-time

## 3. Google Play Console Setup (Android)

1. Go to [Google Play Console](https://play.google.com/console)
2. Create your app if you haven't already
3. Go to "Monetize" → "Products" → "Subscriptions"
4. Create subscription products with the same IDs as iOS

## 4. RevenueCat Dashboard Configuration

1. In your RevenueCat dashboard, go to "Project Settings"
2. Add your App Store Connect and Google Play Store credentials
3. Create Products in RevenueCat that match your store products
4. Create an Offering called "default" with these packages:
   - Monthly package (monthly_premium)
   - Annual package (annual_premium) - mark as "popular"
   - Lifetime package (lifetime_premium)

## 5. Environment Configuration

1. Copy your RevenueCat public API key
2. Update the `.env` file in your project:

```env
VITE_REVENUECAT_API_KEY=your_actual_revenuecat_public_api_key_here
```

## 6. Entitlements Setup

In RevenueCat dashboard:
1. Go to "Entitlements"
2. Create an entitlement called "premium"
3. Attach all your products to this entitlement

## 7. Testing

### iOS Simulator Testing:
- The paywall will show mock data in development mode
- Purchases will be simulated and always succeed

### Device Testing:
1. Create sandbox test users in App Store Connect
2. Sign out of your Apple ID in Settings → App Store
3. When prompted during purchase, sign in with your sandbox test account

### Android Testing:
1. Upload a signed APK to Google Play Console as an "Internal Test"
2. Add test users to the internal test track
3. Install the app from the Play Store (internal test version)

## 8. iOS Widget Extension Entitlements

Since your app includes widget extensions, you may need to:

1. Add RevenueCat entitlements to your widget target in Xcode
2. Update your widget's `Info.plist` to include app group entitlements
3. Share subscription status between main app and widget using App Groups

## 9. Production Deployment

Before releasing to production:

1. Test thoroughly with sandbox accounts
2. Verify all products are approved in both stores
3. Ensure RevenueCat webhooks are configured for your backend (if needed)
4. Test the restore purchases functionality

## 10. Analytics and Monitoring

RevenueCat provides excellent analytics out of the box:
- Conversion rates
- Revenue tracking
- Cohort analysis
- Churn analysis

Access these in your RevenueCat dashboard under "Charts".

## Notes

- The current implementation includes a "skip" button in development mode
- All transactions are handled securely through RevenueCat
- Subscription status is stored locally and synced with RevenueCat
- The paywall appears after onboarding completion
- Users can restore previous purchases

## Troubleshooting

### Common Issues:
1. **"No products found"**: Check product IDs match between stores and RevenueCat
2. **Purchases fail**: Verify app is signed and uploaded to store for testing
3. **Restore doesn't work**: Ensure user is signed in to same store account

### Support:
- RevenueCat Documentation: https://docs.revenuecat.com/
- RevenueCat Support: Available in your dashboard
