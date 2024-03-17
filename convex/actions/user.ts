"use node";
import { createTransport } from "nodemailer";
import { v } from "convex/values";

import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { truncateString } from "../utils";
import { ResetPasswordEmailTemplate } from "../templates/user";

const transporter = createTransport({
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendResetPasswordCodeEmail = action({
  args: { code: v.string(), email: v.string(), did: v.string() },
  handler: async (_, args) => {
    const truncatedDid = truncateString(args.did);
    const html = ResetPasswordEmailTemplate({
      resetCode: args.code,
      did: truncatedDid,
    });

    const mailOptions = {
      from: "'Finsight AI' <hey@finsightai.co>",
      to: args.email,
      subject: "Your reset password code is here!",
      html: html,
    };

    await transporter.sendMail(mailOptions);
  },
});
