import config from '../config/config.js';
import twilio from 'twilio';

//Nodemailer
import { createTransport } from 'nodemailer';
export const transport = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ludie.brown94@ethereal.email',
        pass: 'gcxcYBuv9wh5mTTxdG'
    }
});

export function sendMail(subject, html) {
    transport.sendMail({
        from: config.nodemailer.USER_FROM,
        to: 'stefaniapleon@gmail.com',
        subject,
        html
    })
    console.log('mail sent')
}

//SMS
const sid = config.twilio.CLIENT_SID;
const token = config.twilio.AUTH_TOKEN;
const client = twilio(sid, token);
export async function sendSMS(body) {
    try {
        const message = await client.messages.create({
            body,
            from: config.twilio.PHONE_NUMBER,
            to: config.twilio.PERSONAL_NUMBER
        })
        console.log(message);
    } catch (err) {
        console.log(err)
    }
}

//Whatsapp
export async function sendWhatsapp(body) {
    try {
        const wapp = await client.messages.create({
            from: config.twilio.SANDBOX_WHATSAPP_NUMBER,
            to: config.twilio.WHATSAPP_PERSONAL_NUMBER,
            body
        })
        console.log(wapp)
    } catch(err) {
        console.log(err)
    }
}