import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ email, emailType, userId ,token}: any) => {
  try {
 // create a hased token
 const hashedToken = await bcryptjs.hash(userId.toString(), 1);
  if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, 
          {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
  } else if (emailType === "RESET"){
      await User.findByIdAndUpdate(userId, 
          {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
  }

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

    const info = await transport.sendMail({
  from: "no-reply@yourapp.com",
  to: email,
  subject: emailType === "VERIFY"
    ? "Verify your email"
    : "Reset your password",
  html:emailType==="VERIFY"? `
    <p>
      Click <a href="${process.env.domain}/verifyemail?token=${token}">
        here
      </a>
    </p>
  `: `
    <p>
      Click <a href="${process.env.domain}/resetpassword?token=${token}">
        here
      </a>
    </p>
  `,
});

console.log("Email sent:", info);

  } catch (error: any) {
    
  }
};
