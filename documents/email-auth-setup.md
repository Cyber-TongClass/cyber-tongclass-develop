# Email Auth Setup Checklist

## Required environment variables

### Convex / app base
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_SITE_URL`

### SMTP (163 mail)
- `SMTP_HOST` (recommended: `smtp.163.com`)
- `SMTP_PORT` (recommended: `465`)
- `SMTP_USER` (you said: `tongclasspku@163.com`)
- `SMTP_PASS` (SMTP auth/app password)
- `SMTP_FROM` (recommended: `"TongClass" <noreply@tongclass.ac.cn>`)

### Cloudflare Turnstile
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET`

### Verification token behavior
- `EMAIL_SIGNING_KEY` (required for password reset proof signing)
- `EMAIL_TOKEN_EXPIRY_MIN` (password reset token expiry, default fallback `15`)
- `EMAIL_VERIFY_EXPIRY_MIN` (email verification expiry, default fallback `30`)

## Optional fallback envs used by API
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`

## Post-change commands

```powershell
npm install
npx convex codegen
npx convex deploy
npm run build
```

## Manual smoke test
1. Register page: send code, verify code, continue registration.
2. Forgot password: request reset email, click link, set new password, login with new password.
3. Settings page: change password with current password.
4. Safety path: trigger frequent send requests and verify Turnstile appears.
