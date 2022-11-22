import twilio, { Twilio } from 'twilio';

let client: Twilio

export function getTwilioClient() {
    if (client)
        return client

        console.log();
        
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    return client
}

export async function sendMessage(to: string, body: string) {
    return await getTwilioClient().messages.create({ to, body, from: '+13466605059' })
}