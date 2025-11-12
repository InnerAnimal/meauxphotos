# Twilio Integration Setup

Twilio has been successfully integrated into the MeauxPhotos application.

## What Was Added

1. **Twilio Package**: Added `twilio` v5.3.5 to `package.json`
2. **Twilio Client**: Created `lib/twilio/client.ts` for Twilio client initialization
3. **SMS Utility**: Created `lib/twilio/sms.ts` with `sendSMS()` function
4. **SMS API Route**: Created `app/api/twilio/sms/route.ts` for sending SMS via API

## Environment Variables

Add these to your `.env.local` file (or Vercel environment variables):

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

## Usage

### Server Action / API Route

```typescript
import { sendSMS } from '@/lib/twilio/sms'

const result = await sendSMS({
  to: '+1234567890',
  body: 'Your message here',
  from: '+1234567890' // Optional, uses TWILIO_PHONE_NUMBER if not provided
})
```

### API Endpoint

```bash
POST /api/twilio/sms
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Your message here",
  "from": "+1234567890" // Optional
}
```

## Next Steps

1. **Install dependencies**: Run `npm install` to install the Twilio package
2. **Get Twilio Phone Number**: If you don't have one, purchase a phone number in your Twilio console
3. **Add to Vercel**: Add the environment variables to your Vercel project settings
4. **Test**: Use the API endpoint or import the utility function to send test messages

## Security Notes

- The SMS API route requires authentication (checks for Supabase session)
- Never expose your `TWILIO_AUTH_TOKEN` in client-side code
- Keep your Twilio credentials secure in environment variables only

