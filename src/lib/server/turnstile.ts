type TurnstileVerifyResult = {
    success: boolean
    challenge_ts?: string
    hostname?: string
    [key: string]: unknown
}

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
    const secret = process.env.TURNSTILE_SECRET
    if (!secret) {
        // Allow local development without Turnstile secrets.
        return { success: true, skipped: true }
    }

    const body = new URLSearchParams({
        secret,
        response: token,
    })

    if (remoteIp) {
        body.set("remoteip", remoteIp)
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    })

    if (!response.ok) {
        return { success: false }
    }

    const json = (await response.json()) as TurnstileVerifyResult
    return { success: !!json.success, raw: json }
}
