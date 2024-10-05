import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from "../server";

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

export const connect_nodemailer = () => {
    transporter = nodemailer.createTransport({
        host: EMAIL_HOST || "smtp.gmail.com",
        port: Number(EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
    } as SMTPTransport.Options); // Explicitly cast to SMTPTransport.Options

    transporter.verify(function (error, success) {
        if (error) {
            console.log("||||||||||||||||||||||||||||||||")
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
}


export async function send_Email(
    link: string = "",
    sendTo: string = "",
    subject: string = "",
    text: string = "",
    html: string = "") {
    // send mail with defined transport object
    try {
        const info = await transporter.sendMail({
            from: EMAIL_USER || "", // sender address
            to: sendTo, // list of receivers
            subject: "VNSLUXE - Password Reset", // Subject line
            text: "Click the link below to reset your password:", // plain text body
            html: `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #0044cc; color: #ffffff;">
                                <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center;">
                                <p style="font-size: 16px; color: #333333;">Click the button below to reset your password. If you did not request this password reset, please ignore this email.</p>
                                <a href="${link}" style="display: inline-block; padding: 15px 25px; font-size: 16px; color: #ffffff; background-color: #28a745; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
                                <p style="font-size: 14px; color: #777777; margin: 0;">If you have any questions, feel free to <a href="mailto:support@example.com" style="color: #0044cc;">contact our support team</a>.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        console.log("Message sent: %s", info.messageId);

        if (info) return info
    } catch (error) {
        console.log(error);
        return null
    }

}

