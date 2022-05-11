import dotenv from 'dotenv';

dotenv.config();

export default {
    mongo: {
        url: process.env.MONGO_URL
    },
    session: {
        SUPERADMIN: process.env.SESSION_SUPERADMIN,
        SUPERADMIN_PASSWORD: process.env.SESSION_SUPERADMIN_PASSWORD
    },
    jwt: {
        cookie_name: process.env.JWT_COOKIE_NAME,
        secret: process.env.JWT_SECRET
    },
    aws: {
        ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        SECRET: process.env.AWS_SECRET
    },
    twilio: {
        CLIENT_SID: process.env.TWILIO_CLIENT_SID,
        AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
        SANDBOX_WHATSAPP_NUMBER: process.env.TWILIO_SANDBOX_WHATSAPP_NUMBER,
        PERSONAL_NUMBER: process.env.TWILIO_PERSONAL_NUMBER,
        WHATSAPP_PERSONAL_NUMBER: process.env.TWILIO_WHATSAPP_PERSONAL_NUMBER
    },
    nodemailer: {
        USER_FROM: process.env.NODEMAILER_USER_FROM
    }
}