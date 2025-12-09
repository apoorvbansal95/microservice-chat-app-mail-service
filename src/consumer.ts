import amqp from "amqplib"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_host,
            port: 5672,
            username: process.env.Rabbitmq_username,
            password: process.env.Rabbitmq_password
        })
        const channel = await connection.createChannel()
        const queueName = "send-otp"
        await channel.assertQueue(queueName, { durable: true })
        console.log("✅ Mail service consumer started for listening for otps")

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString())
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD
                        }

                    })
                    await transporter.sendMail({
                        from: "chat APP",
                        to,
                        subject,
                        text: body
                    })
                    console.log(`✅ OTP Mail sent successfully to ${to}`)
                    channel.ack(msg)
                }
                catch (err) {
                    console.log("Failed to send otp mail", err)
                }
            }
        })
    }
    catch (err) {
        console.log("Failed to connect to RabbitMQ consumer", err)

    }
}