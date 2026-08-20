import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const file = formData.get('attachment') as File | null;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'harshitborana75@gmail.com',
        pass: process.env.EMAIL_PASS // App Password
      }
    });

    const mailOptions: any = {
      from: process.env.EMAIL_USER || 'harshitborana75@gmail.com',
      to: 'harshitborana75@gmail.com',
      subject: subject ? `Portfolio Contact: ${subject}` : `New Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
      replyTo: email
    };

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      mailOptions.attachments = [
        {
          filename: file.name,
          content: buffer
        }
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log('Successfully sent contact email from:', name);
    return NextResponse.json({ success: true, message: 'Message received successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
