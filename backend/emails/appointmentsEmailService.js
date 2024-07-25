import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({date, time}){
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
  
      )


      const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: "AppSalon - Nueva Cita",
        text: "AppSalon - Nueva Cita",
        html: `<p>Hola: Admin, tienes una nueva cita</p>
            <p>La cita será el día: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Mensaje enviado', info.messageId);
}

export async function sendEmailUpdateAppointment({date, time}){
  const transporter = createTransport(
      process.env.EMAIL_HOST,
      process.env.EMAIL_PORT,
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS,

    )


    const info = await transporter.sendMail({
      from: 'AppSalon <citas@appsalon.com>',
      to: 'admin@appsalon.com',
      subject: "AppSalon - Cita actualizada",
      text: "AppSalon -  Cita actualizada",
      html: `<p>Hola: Admin, un usuario ha modificado una cita</p>
          <p>La nueva cita será el ${date} a las ${time} horas</p>
      `
  })

  console.log('Mensaje enviado', info.messageId);
}

export async function sendEmailCancelledAppointment({date, time}){
  const transporter = createTransport(
      process.env.EMAIL_HOST,
      process.env.EMAIL_PORT,
      process.env.EMAIL_USER,
      process.env.EMAIL_PASS,

    )


    const info = await transporter.sendMail({
      from: 'AppSalon <citas@appsalon.com>',
      to: 'admin@appsalon.com',
      subject: "AppSalon - Cita cancelada",
      text: "AppSalon -  Cita cancelada",
      html: `<p>Hola: Admin, un usuario ha camcelado una cita</p>
          <p>La cita eliminada era el ${date} a las ${time} horas</p>
      `
  })

  console.log('Mensaje enviado', info.messageId);
}