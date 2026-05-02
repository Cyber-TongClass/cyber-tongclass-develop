const { MailtrapClient } = require("mailtrap")

const token = process.env.MAILTRAP_API_TOKEN
const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || "hello@demomailtrap.co"
const senderName = process.env.MAILTRAP_SENDER_NAME || "Mailtrap Test"
const recipient = process.env.SMOKE_TEST_RECIPIENT || "you@example.com"

if (!token) {
  console.error("MAILTRAP_API_TOKEN is not set. Export it and rerun the script.")
  process.exit(1)
}

const client = new MailtrapClient({ token })

const sender = {
  email: senderEmail,
  name: senderName,
}

const recipients = [
  {
    email: recipient,
  },
]

client
  .send({
    from: sender,
    to: recipients,
    subject: "TongClass Mailtrap smoke test",
    text: "This is a smoke test from TongClass using Mailtrap API",
    html: "<p>This is a <strong>smoke test</strong> from TongClass using Mailtrap API</p>",
    category: "Integration Test",
  })
  .then((res) => {
    console.log("Mailtrap send response:", res)
    process.exit(0)
  })
  .catch((err) => {
    console.error("Mailtrap send error:", err)
    process.exit(2)
  })
