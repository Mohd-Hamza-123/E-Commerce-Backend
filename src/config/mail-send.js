"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_Email = exports.connect_nodemailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const server_1 = require("../server");
let transporter;
const connect_nodemailer = () => {
    transporter = nodemailer_1.default.createTransport({
        host: server_1.EMAIL_HOST || "smtp.gmail.com",
        port: Number(server_1.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: server_1.EMAIL_USER,
            pass: server_1.EMAIL_PASSWORD,
        },
    }); // Explicitly cast to SMTPTransport.Options
    transporter.verify(function (error, success) {
        if (error) {
            console.log("||||||||||||||||||||||||||||||||");
            console.log(error);
        }
        else {
            console.log("Server is ready to take our messages");
        }
    });
};
exports.connect_nodemailer = connect_nodemailer;
function send_Email(link = "", sendTo = "", subject = "", text = "", html = "") {
    return __awaiter(this, void 0, void 0, function* () {
        // send mail with defined transport object
        try {
            const info = yield transporter.sendMail({
                from: server_1.EMAIL_USER || "", // sender address
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
            if (info)
                return info;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.send_Email = send_Email;
