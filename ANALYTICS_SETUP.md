# Google Analytics Setup Guide

This guide explains how to set up Google Analytics tracking for your HonestBox application.

## 1. Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create a new property for your website
5. Set up a Web data stream
6. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

## 2. Configure Environment Variables

Create a `.env` file in your project root with your Google Analytics Measurement ID:

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Enable analytics in development
VITE_ENABLE_ANALYTICS=false
```

**Important**:

- Replace `G-XXXXXXXXXX` with your actual Measurement ID
- Never commit your `.env` file to version control
- Set `VITE_ENABLE_ANALYTICS=true` only if you want to track events during development

## 3. Deploy Configuration

For production deployment, set the environment variable in your hosting platform:

### Vercel

```bash
vercel env add VITE_GA_MEASUREMENT_ID
```

### Netlify

Add in site settings under Environment Variables:

- Key: `VITE_GA_MEASUREMENT_ID`
- Value: `G-XXXXXXXXXX`

### Other platforms

Set the environment variable `VITE_GA_MEASUREMENT_ID` with your Measurement ID

## 4. Tracked Events

The application automatically tracks the following events:

### Authentication Events

- User sign up (email/Google)
- User login (email/Google)
- Login/signup errors

### Feedback Events

- Feedback request created
- Anonymous feedback sent
- Feedback request shared (copy link/social share)

### User Engagement

- Page views
- Theme toggle (light/dark mode)
- External link clicks

### Error Tracking

- Application errors with context

## 5. Privacy Features

The implementation includes privacy-focused settings:

- **IP Anonymization**: Enabled by default
- **Google Signals**: Disabled (no cross-device tracking)
- **Ad Personalization**: Disabled
- **Secure Cookies**: SameSite=Strict policy
- **Development Mode**: Analytics disabled by default in development

## 6. Verify Setup

1. Deploy your application with the environment variable set
2. Visit your website
3. Check Google Analytics Real-time reports
4. Verify events are being tracked correctly

## 7. Custom Event Tracking

To add custom tracking events, use the analytics utility:

```typescript
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from '@/lib/analytics';

// Track custom event
trackEvent({
  action: 'custom_action',
  category: EVENT_CATEGORIES.USER_ENGAGEMENT,
  label: 'Optional label',
  custom_parameters: {
    custom_data: 'value'
  }
});
```

## 8. Debugging

- Check browser console for analytics initialization messages
- Verify environment variable is set correctly: `console.log(import.meta.env.VITE_GA_MEASUREMENT_ID)`
- Use Google Analytics DebugView for real-time event debugging
- Enable analytics in development: set `VITE_ENABLE_ANALYTICS=true` in `.env`

## Data Privacy Compliance

This implementation includes privacy-first defaults:

- Anonymized IP addresses
- No cross-site tracking
- No advertising features
- Secure cookie configuration

Ensure you comply with your local privacy laws (GDPR, CCPA, etc.) by:

- Adding a privacy policy
- Implementing cookie consent if required
- Informing users about analytics collection
