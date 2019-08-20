const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "PingPongSimijaca@gmail.com",
        subject: "Gracias por registrarte a PingPong Simijaca.",
        text: `Bienvenid@ ${name}. Ahora eres parte de PingPong Simijaca.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "PingPongSimijaca@gmail.com",
        subject: "Es una lástima ver que te vas :c",
        text: `${name}, ¿Por qué te vas?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}