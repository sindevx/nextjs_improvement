// src/utils/emailConfig.ts
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_APP_MAIL_EMAIL,
    pass: process.env.NEXT_APP_MAIL_PASSWORD
  }
})