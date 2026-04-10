import nodemailer from 'nodemailer';

const sendWelcomeEmail = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
        from: `"Edumon Portal" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to Edumon - Your Account is Ready',
        html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0284c7;">Welcome to Edumon, ${name}!</h2>
          <p>Your institutional account has been created successfully. You can now login to the dashboard.</p>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Username:</strong> ${email}</p>
            <p style="margin: 5px 0 0 0;"><strong>Temporary Password:</strong> ${password}</p>
          </div>
          <p>Please change your password after your first login.</p>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendWelcomeEmail;
