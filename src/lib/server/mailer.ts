import nodemailer from "nodemailer"
import { buildVerificationEmailContent } from "./email-template"

type VerificationMailPurpose = "email_verification" | "password_reset"

const DEFAULT_FROM = '"TongClass" <noreply@tongclass.ac.cn>'

function getTransporter() {
    const host = process.env.SMTP_HOST || "smtp.163.com"
    const port = Number(process.env.SMTP_PORT || 465)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!user || !pass) {
        throw new Error("SMTP_USER or SMTP_PASS is not configured")
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    })
}

export async function sendVerificationEmail(params: {
    to: string
    purpose: VerificationMailPurpose
    link: string
    code: string
    expiryMinutes: number
}) {
    const transporter = getTransporter()
    const smtpUser = process.env.SMTP_USER
    if (!smtpUser) {
        throw new Error("SMTP_USER is not configured")
    }

    const { subject, html, text } = buildVerificationEmailContent({
        purpose: params.purpose,
        link: params.link,
        code: params.code,
        expiryMinutes: params.expiryMinutes,
    })

    const preferredFrom = process.env.SMTP_FROM || DEFAULT_FROM
    const forceAuthFrom = process.env.SMTP_FORCE_AUTH_FROM !== "false"

    const primaryMail = {
        from: forceAuthFrom ? smtpUser : preferredFrom,
        envelope: forceAuthFrom
            ? {
                from: smtpUser,
                to: params.to,
            }
            : undefined,
        to: params.to,
        subject,
        text,
        html,
    }

    try {
        await transporter.sendMail(primaryMail)
    } catch (error) {
        const err = error as {
            message?: string
            code?: string
            responseCode?: number
            response?: string
        }
        const message = `${err.message || ""} ${err.response || ""}`
        const isEnvelopeError =
            /Mail from must equal authorized user|EENVELOPE|553/i.test(message) ||
            err.code === "EENVELOPE" ||
            err.responseCode === 553

        if (!isEnvelopeError || !smtpUser) {
            throw error
        }

        // Some SMTP providers (including 163) require MAIL FROM to equal SMTP_USER.
        await transporter.sendMail({
            from: smtpUser,
            envelope: {
                from: smtpUser,
                to: params.to,
            },
            to: params.to,
            subject,
            text,
            html,
        })
    }
}
