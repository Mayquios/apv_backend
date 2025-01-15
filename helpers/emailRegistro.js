import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos;

    //Enviar el email
    const info = await  transporter.sendMail({
        from: "Administrador de pacientes",
        to: email,
        subject: "Confirmar tu cuenta de Veterinario",
        text: 'Comprueba tu cuenta',
        html: `
        <p> Hola ${nombre},</p>
        <p> Comprueba tu cuenta en el siguiente enlace</p>
        <p><a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar Cuenta </a></p>
        <p>Si no creaste esta cuenta, ignora este mensaje</p>
        `
    });
    console.log('Mensaje enviado: %s', info.messageId);//esto mostrara en el servidor  el id del mensaje enviado


};

export default emailRegistro;