"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, params: Record<string, unknown>) => string
            remove: (widgetId: string) => void
        }
    }
}

type TurnstileWidgetProps = {
    onVerify: (token: string) => void
    className?: string
}

const SCRIPT_ID = "cf-turnstile-script"

function ensureScriptLoaded() {
    return new Promise<void>((resolve, reject) => {
        if (window.turnstile) {
            resolve()
            return
        }

        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
        if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true })
            existing.addEventListener("error", () => reject(new Error("Turnstile script failed")), { once: true })
            return
        }

        const script = document.createElement("script")
        script.id = SCRIPT_ID
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Turnstile script failed"))
        document.head.appendChild(script)
    })
}

export function TurnstileWidget({ onVerify, className }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)

    useEffect(() => {
        let cancelled = false
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

        if (!siteKey || !containerRef.current) {
            return
        }

        ensureScriptLoaded()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) {
                    return
                }

                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: (token: string) => onVerify(token),
                })
            })
            .catch((error) => {
                console.error("Failed to initialize Turnstile", error)
            })

        return () => {
            cancelled = true
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current)
            }
        }
    }, [onVerify])

    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        return null
    }

    return <div ref={containerRef} className={className} />
}
