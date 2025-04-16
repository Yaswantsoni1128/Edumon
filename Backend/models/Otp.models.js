import mongoose from "mongoose";
import mailSender from "../utils/MailSender.js"

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
    otp: {
        type: String,
        required: true,
    }
});

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification email from Grevion", otp);
        console.log("Email sent successfully", mailResponse);
    } catch (error) {
        console.log("Error sending Verification email", error);
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

export const Otp = mongoose.model("Otp",otpSchema)
