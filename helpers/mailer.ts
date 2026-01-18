import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5f86096edbbe19",
    pass: "2c82f242e614dc"
  }
});

    const info = await transport.sendMail({
  from: "no-reply@yourapp.com",
  to: email,
  subject: emailType === "VERIFY"
    ? "Verify your email"
    : "Reset your password",
  html: `
    <p>
      Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">
        here
      </a>
    </p>
  `,
});

console.log("Email sent:", info);

  } catch (error: any) {
    throw new Error(error.message);
  }
};
