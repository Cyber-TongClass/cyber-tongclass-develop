type VerificationMailInput = {
    purpose: "email_verification" | "password_reset"
    link: string
    code: string
    expiryMinutes: number
}

export function buildVerificationEmailContent(input: VerificationMailInput) {
    const isReset = input.purpose === "password_reset"
    const subject = isReset ? "Reset your TongClass password" : "Verify your TongClass account"
    const actionLabel = isReset ? "Reset password" : "Verify email address"
    const intro = isReset
        ? "You requested a password reset for your TongClass account."
        : "Thanks for signing up for TongClass. Please verify your email address."

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${subject}</title>
  </head>
  <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111; line-height:1.5;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 12px 0;color:#0B56A6;">${subject}</h2>
      <p>Hello,</p>
      <p>${intro}</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${input.link}" style="background:#0B56A6;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">${actionLabel}</a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;"><a href="${input.link}">${input.link}</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
      <p style="margin:0 0 8px 0;">Or use this verification code (valid for <strong>${input.expiryMinutes} minutes</strong>):</p>
      <p style="font-size:20px;font-weight:700;letter-spacing:4px;background:#f6f8fa;padding:12px;border-radius:6px;display:inline-block;">${input.code}</p>
      <p style="color:#666;margin-top:20px;font-size:13px;">If you did not request this, you can safely ignore this email. Do not share the code or link with anyone.</p>
      <p style="color:#666;font-size:13px;">Need help? Contact support at <a href="mailto:support@tongclass.ac.cn">support@tongclass.ac.cn</a>.</p>
    </div>
  </body>
</html>`

    const text = `${subject}\n\n${intro}\n\nOpen this link:\n${input.link}\n\nVerification code (valid for ${input.expiryMinutes} minutes): ${input.code}\n\nIf you did not request this, ignore this email.`

    return { subject, html, text }
}
