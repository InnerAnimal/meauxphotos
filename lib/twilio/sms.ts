import { createTwilioClient } from './client'

export interface SendSMSOptions {
  to: string
  body: string
  from?: string
}

export async function sendSMS(options: SendSMSOptions) {
  try {
    const client = createTwilioClient()
    const fromNumber = options.from || process.env.TWILIO_PHONE_NUMBER

    if (!fromNumber) {
      throw new Error('Twilio phone number not configured. Set TWILIO_PHONE_NUMBER environment variable.')
    }

    const message = await client.messages.create({
      body: options.body,
      to: options.to,
      from: fromNumber,
    })

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    }
  }
}

